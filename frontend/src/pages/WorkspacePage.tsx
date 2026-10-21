import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Mic, FileAudio, FileText, CheckCircle2, AlertCircle,
  ShieldAlert, Sparkles, RefreshCw, ArrowRight, Info, Layers
} from 'lucide-react';
import { AudioPlayer } from '../components/AudioPlayer';
import { AudioRecorder } from '../components/AudioRecorder';
import { api } from '../services/api';
import { AnalysisResponse } from '../types';

export const WorkspacePage: React.FC = () => {
  const navigate = useNavigate();

  // Mode: 'upload' | 'record' | 'text'
  const [activeTab, setActiveTab] = useState<'upload' | 'record' | 'text'>('upload');

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('en');

  // Text-only mode state
  const [manualTranscript, setManualTranscript] = useState<string>('');

  // Editable transcript state
  const [editableTranscript, setEditableTranscript] = useState<string>('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preset demonstration scenarios for instant testing at Expo
  const presetScenarios = [
    {
      title: 'Digital Arrest / CBI Scam',
      badge: 'Critical Risk',
      color: 'border-rose-200 text-rose-700 bg-rose-50',
      text: "This is Inspector Sharma from the Crime Branch CBI headquarters Delhi. A non-bailable arrest warrant has been issued against you for illegal money laundering. You are currently under digital arrest. Do not disconnect this call, stay inside your room, and immediately transfer funds to the government safe account for verification."
    },
    {
      title: 'Bank KYC & OTP Harvesting',
      badge: 'Critical Risk',
      color: 'border-rose-200 text-rose-700 bg-rose-50',
      text: "Hello, I am calling from State Bank of India fraud prevention department. Your debit card and net banking account are suspended due to pending KYC. Within 15 minutes your account will be permanently blocked. Please read out the 6-digit verification code OTP you just received on your registered mobile number."
    },
    {
      title: 'AnyDesk Remote Hijack',
      badge: 'High Risk',
      color: 'border-orange-200 text-orange-700 bg-orange-50',
      text: "Urgent alert from Microsoft Windows support. Multiple dangerous trojan viruses have breached your computer and are targeting your banking passwords. You must install AnyDesk application immediately from the Play Store so our security engineer can remotely control your screen and clear the infection."
    },
    {
      title: 'Benign Customer Service Call',
      badge: 'Low Risk',
      color: 'border-emerald-200 text-emerald-700 bg-emerald-50',
      text: "Hi there! This is Priya from FreshGrocers calling regarding your order placed this morning. We have all items packed and our delivery executive will arrive at your address around 4:30 PM today. Have a wonderful afternoon!"
    }
  ];

  const handleFileSelect = (file: File) => {
    setError(null);
    setSelectedFile(file);
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudioPreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const loadPresetScenario = (scenarioText: string) => {
    setError(null);
    setActiveTab('text');
    setManualTranscript(scenarioText);
  };

  const runAnalysis = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      let analysisResult: AnalysisResponse;

      if (activeTab === 'text') {
        if (!manualTranscript.trim()) {
          throw new Error('Please enter transcript text before analyzing.');
        }
        setProcessingStep('Evaluating transcript with cybersecurity rule engine...');
        analysisResult = await api.analyzeTranscript(manualTranscript, language);
      } else {
        if (!selectedFile) {
          throw new Error('Please upload an audio file or record from microphone first.');
        }

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('language', language);
        if (editableTranscript.trim()) {
          formData.append('edited_transcript', editableTranscript.trim());
        }

        setProcessingStep('1/4: Validating audio integrity & headers...');
        await new Promise((r) => setTimeout(r, 400));
        setProcessingStep('2/4: Transcribing speech with Whisper STT...');
        await new Promise((r) => setTimeout(r, 600));
        setProcessingStep('3/4: Inspecting social engineering & scam indicators...');
        await new Promise((r) => setTimeout(r, 400));
        setProcessingStep('4/4: Performing acoustic signal forensics...');

        analysisResult = await api.analyzeAudio(formData);
      }

      // Navigate to detailed report page
      navigate(`/analyses/${analysisResult.id}`, { state: { result: analysisResult } });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during audio analysis.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>CYBERSECURITY INCIDENT WORKSPACE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Audio Scam Risk Analyzer</h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Upload suspicious voice messages, record calls directly through browser audio, or evaluate transcripts for social engineering and acoustic anomalies.
        </p>
      </div>

      {/* Preset Scenarios Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>EXPO DEMO PRESETS (Instant 1-Click Evaluation)</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">INS Expo Test Suite</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presetScenarios.map((sc, i) => (
            <button
              key={i}
              type="button"
              onClick={() => loadPresetScenario(sc.text)}
              className="p-3.5 text-left rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 transition-all flex flex-col justify-between space-y-2 group shadow-soft-sm"
            >
              <div>
                <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full border ${sc.color} mb-2`}>
                  {sc.badge}
                </span>
                <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {sc.title}
                </p>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 italic">
                "{sc.text}"
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-soft">
        {/* Input Mode Selector Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition -mb-px ${
              activeTab === 'upload'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Audio File</span>
          </button>

          <button
            onClick={() => setActiveTab('record')}
            className={`flex items-center space-x-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition -mb-px ${
              activeTab === 'record'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Record via Microphone</span>
          </button>

          <button
            onClick={() => setActiveTab('text')}
            className={`flex items-center space-x-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition -mb-px ${
              activeTab === 'text'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Text Transcript Only</span>
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-3 text-rose-700 text-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-800">Analysis Error</span>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Tab 1: File Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept=".wav,.mp3,.m4a,.webm,.ogg,.flac"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 sm:p-12 text-center bg-slate-50/60 hover:bg-slate-50 transition-all group space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mx-auto group-hover:scale-105 transition-transform">
                <FileAudio className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  Click to upload or drag & drop audio recording
                </p>
                <p className="text-xs text-slate-500">
                  Supported formats: WAV, MP3, M4A, WebM, OGG, FLAC (Max: 25MB, up to 10 minutes)
                </p>
              </div>
            </div>

            {selectedFile && audioPreviewUrl && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-medium">Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setAudioPreviewUrl(null);
                    }}
                    className="text-rose-600 hover:text-rose-800 font-medium transition"
                  >
                    Remove File
                  </button>
                </div>
                <AudioPlayer src={audioPreviewUrl} filename={selectedFile.name} />
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Microphone Recorder */}
        {activeTab === 'record' && (
          <AudioRecorder
            onRecordingComplete={(file) => {
              setSelectedFile(file);
              setAudioPreviewUrl(URL.createObjectURL(file));
            }}
            onClear={() => {
              setSelectedFile(null);
              setAudioPreviewUrl(null);
            }}
          />
        )}

        {/* Tab 3: Text Transcript Only */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Spoken Transcript / Dialogue Text
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {manualTranscript.length} characters
              </span>
            </div>
            <textarea
              rows={6}
              value={manualTranscript}
              onChange={(e) => setManualTranscript(e.target.value)}
              placeholder="Paste or type spoken conversation text to inspect social engineering keywords, urgency threats, or OTP demands..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-sans"
            />
            <p className="text-xs text-slate-500 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-slate-400" />
              <span>Text-only mode evaluates scam language; experimental audio acoustic forensics is disabled.</span>
            </p>
          </div>
        )}

        {/* Language & Settings Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Speech Recognition Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
            >
              <option value="en">English (India / US / International)</option>
              <option value="hi">Hindi (हिन्दी / Hinglish Dialects)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Forensics Mode</label>
            <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Full Forensics: Rule Engine + Acoustic Jitter & Rolloff</span>
            </div>
          </div>
        </div>

        {/* Action Trigger Button */}
        <div className="pt-2">
          <button
            onClick={runAnalysis}
            disabled={isProcessing || (activeTab !== 'text' && !selectedFile) || (activeTab === 'text' && !manualTranscript.trim())}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-soft hover:shadow-soft-md flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="font-mono">{processingStep || 'Processing Forensic Pipeline...'}</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4" />
                <span>Execute VoiceShield Forensics Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
