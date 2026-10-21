import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';

interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  onClear: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, onClear }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setError(null);
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Browser audio recording is not supported in this browser environment.');
      return;
    }

    try {
      // Request explicit user permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const ext = mimeType.includes('webm') ? 'webm' : 'ogg';
        const file = new File([audioBlob], `mic_recording_${Date.now()}.${ext}`, { type: mimeType });
        onRecordingComplete(file);

        // Stop all tracks to turn off hardware microphone indicator
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250); // slice every 250ms
      setIsRecording(true);
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission was denied. Please allow microphone access in your browser settings to record audio.');
      } else {
        setError(`Failed to access microphone: ${err.message || 'Unknown error'}`);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const clearRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setDuration(0);
    onClear();
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex flex-col space-y-4">
      {error && (
        <div className="p-3 bg-rose-950/40 border border-rose-800 rounded-lg flex items-start space-x-2 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!audioUrl ? (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-slate-700 hover:border-slate-600 rounded-xl bg-slate-900/40 text-center">
          <div className="relative mb-4">
            {isRecording && (
              <span className="absolute -inset-2 rounded-full bg-rose-500/20 animate-ping"></span>
            )}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition shadow-lg ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyber-glow'
              }`}
            >
              {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-7 h-7" />}
            </button>
          </div>

          {isRecording ? (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-rose-400 font-mono text-lg font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span>Recording: {formatTimer(duration)}</span>
              </div>
              <p className="text-xs text-slate-400">Speak clearly. Click the square button when finished.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-200">Record Spoken Call Directly</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Requires browser microphone permission. Recorded locally and processed without persistent retention by default.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Voice recording captured ({formatTimer(duration)})</span>
            </span>
            <button
              onClick={clearRecording}
              className="text-xs text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Record Again</span>
            </button>
          </div>
          <AudioPlayer src={audioUrl} filename={`Microphone_Take_${formatTimer(duration)}.webm`} duration={duration} />
        </div>
      )}
    </div>
  );
};
