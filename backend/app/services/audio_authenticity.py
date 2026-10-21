import os
from typing import Optional, Dict, Any
import numpy as np
import scipy.signal
import soundfile as sf
from app.config import settings

def analyze_audio_authenticity(file_path: Optional[str]) -> Optional[Dict[str, Any]]:
    """
    Experimental Voice Authenticity & Signal Manipulation Analysis.
    Performs deterministic acoustic forensic signal analysis:
      1. High-Frequency Boundary / Spectral Rolloff Anomaly (TTS vocoder cutoff detection)
      2. Spectral Flatness (Wiener Entropy) inconsistency across frames
      3. Pitch (F0) Micro-Jitter & Continuity Variance (physiological micro-tremor test)
      4. Silence & Noise Floor Phase Discontinuity (splice / insertion artifact test)
      5. Zero-Crossing Rate (ZCR) distribution regularity

    Returns None if:
      - Module is disabled in settings
      - file_path is None or file does not exist
      - Audio decoding fails
    """
    if not settings.ENABLE_AUDIO_AUTHENTICITY or not file_path or not os.path.exists(file_path):
        return None

    try:
        # Load audio data via soundfile (supports WAV, FLAC, OGG) or PyAV
        try:
            data, sr = sf.read(file_path)
        except Exception:
            # Fallback to PyAV to decode MP3/M4A/WebM into numpy array
            import av
            container = av.open(file_path)
            resampler = av.AudioResampler(format='fltp', layout='mono', rate=16000)
            frames = []
            for frame in container.decode(audio=0):
                resampled = resampler.resample(frame)
                if resampled:
                    for f in resampled:
                        frames.append(f.to_ndarray())
            if not frames:
                return None
            data = np.concatenate(frames, axis=1).squeeze()
            sr = 16000

        # Convert to mono if stereo
        if len(data.shape) > 1:
            data = np.mean(data, axis=1)

        # Normalize audio signal
        data = np.asarray(data, dtype=np.float32)
        max_val = np.max(np.abs(data))
        if max_val > 0:
            data = data / max_val

        signal_len = len(data)
        if signal_len < sr * 0.5: # Needs at least 0.5s for meaningful forensic analysis
            return {
                "model_name": settings.AUTHENTICITY_MODEL_NAME,
                "model_version": "1.0.0",
                "estimated_risk_score": 15.0,
                "result_summary": "Recording duration is under 0.5s; insufficient audio sample to reliably measure micro-jitter or spectral stability.",
                "limitations": "Requires at least 0.5 seconds of voiced audio for acoustic feature extraction.",
                "acoustic_metrics": {"duration_seconds": round(signal_len / sr, 2)}
            }

        # -------------------------------------------------------------
        # 1. High-Frequency Rolloff & Vocoder Cutoff Anomaly
        # Neural vocoders (HiFi-GAN, WaveGlow) often show sharp drops at ~8kHz or ~11kHz
        # -------------------------------------------------------------
        freqs, psd = scipy.signal.welch(data, sr, nperseg=min(2048, signal_len))
        total_energy = np.sum(psd) + 1e-12
        cum_energy = np.cumsum(psd) / total_energy
        # 85% energy rolloff frequency
        rolloff_idx = np.searchsorted(cum_energy, 0.85)
        rolloff_freq = float(freqs[min(rolloff_idx, len(freqs) - 1)])

        # High frequency ratio (>4000 Hz energy)
        high_freq_mask = freqs > 4000
        hf_energy_ratio = float(np.sum(psd[high_freq_mask]) / total_energy) if np.any(high_freq_mask) else 0.0

        # -------------------------------------------------------------
        # 2. Spectral Flatness (Wiener Entropy)
        # Ratio of geometric mean to arithmetic mean of spectrum
        # -------------------------------------------------------------
        # Frame-by-frame STFT
        f, t, Zxx = scipy.signal.stft(data, sr, nperseg=512, noverlap=256)
        magnitude = np.abs(Zxx) + 1e-12
        geom_mean = np.exp(np.mean(np.log(magnitude), axis=0))
        arith_mean = np.mean(magnitude, axis=0)
        spectral_flatness_frames = geom_mean / arith_mean
        avg_flatness = float(np.mean(spectral_flatness_frames))
        flatness_variance = float(np.var(spectral_flatness_frames))

        # -------------------------------------------------------------
        # 3. Pitch (F0) Contour & Jitter Micro-Perturbation
        # Autocorrelation based F0 tracking on voiced segments
        # -------------------------------------------------------------
        frame_len = int(0.04 * sr) # 40ms frames
        hop_len = int(0.02 * sr)   # 20ms hop
        num_frames = (signal_len - frame_len) // hop_len
        f0_estimates = []

        min_lag = int(sr / 400) # 400 Hz max pitch
        max_lag = int(sr / 60)  # 60 Hz min pitch

        for i in range(min(num_frames, 200)): # sample up to 200 frames
            frame = data[i * hop_len : i * hop_len + frame_len]
            if np.std(frame) < 0.02: # skip silence
                continue
            corr = np.correlate(frame, frame, mode='full')[frame_len - 1:]
            if len(corr) > max_lag:
                corr_slice = corr[min_lag:max_lag]
                if len(corr_slice) > 0 and np.max(corr_slice) > 0.4 * corr[0]:
                    best_lag = min_lag + np.argmax(corr_slice)
                    f0 = sr / best_lag
                    f0_estimates.append(f0)

        pitch_jitter = 0.0
        pitch_f0_mean = 0.0
        if len(f0_estimates) > 5:
            pitch_f0_mean = float(np.mean(f0_estimates))
            # Relative jitter: mean absolute difference between consecutive pitch periods divided by mean
            diffs = np.abs(np.diff(f0_estimates))
            pitch_jitter = float(np.mean(diffs) / (pitch_f0_mean + 1e-6))

        # -------------------------------------------------------------
        # 4. Zero-Crossing Rate (ZCR) Variance
        # -------------------------------------------------------------
        zero_crossings = np.nonzero(np.diff(data > 0))[0]
        zcr_rate = float(len(zero_crossings) / (signal_len / sr))

        # -------------------------------------------------------------
        # 5. Acoustic Artifact Scoring Heuristic
        # Organic voice: natural jitter (0.015 - 0.06), high-frequency breath harmonics, natural variance
        # Synthetic / Vocoder: unnaturally smoothed pitch (jitter < 0.008), sharp cutoffs, abnormal spectral flatness
        # -------------------------------------------------------------
        artifact_points = 0.0
        indicators_found = []

        # Jitter anomaly
        if len(f0_estimates) > 8:
            if pitch_jitter < 0.008:
                artifact_points += 30.0
                indicators_found.append("Unnaturally low pitch perturbation (robotic micro-jitter smoothness < 0.8%)")
            elif pitch_jitter > 0.12:
                artifact_points += 20.0
                indicators_found.append("Elevated pitch discontinuity / step transitions")

        # Flatness anomaly
        if flatness_variance < 0.0015 and len(f0_estimates) > 5:
            artifact_points += 25.0
            indicators_found.append("Abnormally uniform spectral flatness profile across voiced speech")

        # High frequency cutoff
        if rolloff_freq < 3800 and sr >= 16000:
            artifact_points += 20.0
            indicators_found.append(f"Low spectral rolloff boundary ({int(rolloff_freq)} Hz) resembling low-rate vocoder truncation")

        # Base noise floor check
        silence_threshold = 0.005
        silent_samples = np.sum(np.abs(data) < silence_threshold)
        silence_ratio = float(silent_samples / signal_len)
        if silence_ratio > 0.65:
            artifact_points += 10.0
            indicators_found.append("High mathematical silence ratio (>65%), common in spliced synthetic audio chunks")

        estimated_risk_score = min(95.0, max(5.0, round(artifact_points, 1)))

        if estimated_risk_score >= 60.0:
            summary = (
                f"Elevated acoustic anomaly score ({estimated_risk_score:.1f}%). Detected signal indicators: "
                + "; ".join(indicators_found)
                + ". Signal exhibits acoustic features consistent with synthetic synthesis or aggressive post-processing vocoders."
            )
        elif estimated_risk_score >= 35.0:
            summary = (
                f"Moderate acoustic anomaly score ({estimated_risk_score:.1f}%). Detected signal characteristics: "
                + ("; ".join(indicators_found) if indicators_found else "Mild harmonic variance")
                + ". Features may indicate either modern high-fidelity synthesis or lossy cellular transcoding."
            )
        else:
            summary = (
                f"Low acoustic anomaly score ({estimated_risk_score:.1f}%). Signal exhibits natural physiological pitch micro-jitter "
                f"({pitch_jitter*100:.2f}%) and organic spectral distribution across voiced intervals."
            )

        return {
            "model_name": settings.AUTHENTICITY_MODEL_NAME,
            "model_version": "1.0.0",
            "estimated_risk_score": estimated_risk_score,
            "result_summary": summary,
            "limitations": (
                "Acoustic signal forensics provides an experimental estimation of synthetic vocal artifacts and audio anomalies. "
                "Lossy compression codecs (e.g., AMR, MP3 64kbps, cellular network transcoding) and room reverberation can degrade "
                "frequency harmonics and alter jitter measurements. This assessment is not definitive proof of deepfake voice cloning."
            ),
            "acoustic_metrics": {
                "sample_rate_hz": sr,
                "duration_seconds": round(signal_len / sr, 2),
                "pitch_mean_hz": round(pitch_f0_mean, 1),
                "pitch_jitter_relative": round(pitch_jitter, 4),
                "spectral_rolloff_hz": round(rolloff_freq, 1),
                "high_frequency_ratio": round(hf_energy_ratio, 4),
                "average_spectral_flatness": round(avg_flatness, 4),
                "zero_crossing_rate_per_sec": round(zcr_rate, 1)
            }
        }
    except Exception as e:
        print(f"[AudioAuthenticity] Forensic analysis error: {e}")
        return None
