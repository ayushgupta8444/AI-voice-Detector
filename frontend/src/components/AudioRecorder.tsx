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

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250);
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
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {!audioUrl ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl bg-slate-50/70 text-center transition-colors">
          <div className="relative mb-4">
            {isRecording && (
              <span className="absolute -inset-2.5 rounded-full bg-rose-400/30 animate-ping"></span>
            )}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative w-16 h-16 rounded-full flex items-center justify-center transition shadow-soft ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-700 text-white ring-4 ring-rose-100'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-soft-md'
              }`}
            >
              {isRecording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-7 h-7" />}
            </button>
          </div>

          {isRecording ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-center space-x-2 text-rose-600 font-mono text-lg font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                <span>Recording: {formatTimer(duration)}</span>
              </div>
              <p className="text-xs text-slate-500">Speak clearly. Click the square button when finished.</p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-900">Record Spoken Call Directly</p>
              <p className="text-xs text-slate-500 max-w-sm">
                Requires browser microphone permission. Recorded locally and processed without persistent retention by default.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Voice recording captured ({formatTimer(duration)})</span>
            </span>
            <button
              onClick={clearRecording}
              className="text-xs text-slate-500 hover:text-rose-600 flex items-center space-x-1 transition font-medium"
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
