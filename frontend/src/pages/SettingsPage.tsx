import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon, Shield, Lock, Trash2, CheckCircle2,
  AlertTriangle, RefreshCw, Info, Save
} from 'lucide-react';
import { api } from '../services/api';
import { UserSettings } from '../types';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [retentionEnabled, setRetentionEnabled] = useState<boolean>(false);
  const [retentionDays, setRetentionDays] = useState<number>(7);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const s = await api.getSettings();
        setSettings(s);
        setRetentionEnabled(s.audio_retention_enabled);
        setRetentionDays(s.audio_retention_duration);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user settings.');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const updated = await api.updateSettings({
        audio_retention_enabled: retentionEnabled,
        audio_retention_duration: retentionDays
      });
      setSettings(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handlePurgeAllData = async () => {
    if (window.confirm('Are you sure you want to delete all your analysis reports and history? This cannot be undone.')) {
      try {
        await api.deleteAllAnalyses();
        alert('All previous analysis reports have been permanently deleted.');
      } catch (err: any) {
        alert(`Failed to delete data: ${err.message}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-medium text-slate-500">Loading privacy preferences...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-1">
          <SettingsIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>SECURITY & PRIVACY CONTROLS</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Privacy & Retention Settings</h1>
        <p className="text-xs text-slate-500">Configure how audio recordings and personal analysis reports are retained</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-rose-700 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center space-x-2 text-emerald-800 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Privacy preferences updated successfully.</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-soft">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700">
          <Shield className="w-4 h-4 text-blue-600" />
          <span>AUTHENTICATED OPERATOR PROFILE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 block font-sans text-xs">Operator Alias</span>
            <span className="text-slate-900 font-bold">{user?.display_name || 'N/A'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-500 block font-sans text-xs">Registered Email</span>
            <span className="text-slate-900 font-bold">{user?.email || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Audio Retention Policy Form */}
      <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-soft">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700">
          <Lock className="w-4 h-4 text-blue-600" />
          <span>AUDIO RETENTION POLICY</span>
        </div>

        <div className="space-y-4">
          {/* Toggle Switch */}
          <div className="flex items-start justify-between gap-4 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="space-y-1">
              <span className="text-sm font-bold text-slate-900 block">
                Opt-in Audio File Retention
              </span>
              <p className="text-xs text-slate-600 leading-relaxed max-w-lg">
                By default, VoiceShield AI strictly enforces zero retention: temporary audio files are automatically purged from disk immediately following analysis. Enabling retention archives original audio for evidence preservation.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={retentionEnabled}
                onChange={(e) => setRetentionEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Retention Duration Slider (Conditional) */}
          {retentionEnabled && (
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-700 font-semibold">Automatic Purge Duration</span>
                <span className="font-mono text-blue-700 font-bold">{retentionDays} Days</span>
              </div>

              <input
                type="range"
                min={1}
                max={90}
                value={retentionDays}
                onChange={(e) => setRetentionDays(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded appearance-none cursor-pointer accent-blue-600"
              />

              <p className="text-xs text-slate-500 font-medium">
                Archived recordings older than {retentionDays} days are permanently wiped from server storage.
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center space-x-2 shadow-soft hover:shadow-soft-md disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Preferences...' : 'Save Retention Preferences'}</span>
        </button>
      </form>

      {/* Danger Zone: Purge All History */}
      <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-soft">
        <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
          <Trash2 className="w-4 h-4" />
          <span>DANGER ZONE: DATA ERASURE</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Comply with privacy mandates by permanently erasing all your historical analysis reports, incident telemetry, and retained audio files from the database.
        </p>

        <button
          type="button"
          onClick={handlePurgeAllData}
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition flex items-center space-x-2 shadow-soft"
        >
          <Trash2 className="w-4 h-4" />
          <span>Purge All Analysis Records</span>
        </button>
      </div>

      {/* Limitations Disclosure */}
      <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex items-start space-x-3 text-xs text-slate-600">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-900">Privacy & Forensic Disclaimer:</span>
          <p className="leading-relaxed">
            VoiceShield AI is built adhering to Privacy by Design principles. Transcripts and acoustic signal metrics are stored with Row-Level Security isolation. Data is strictly user-owned and never sold or shared with commercial entities.
          </p>
        </div>
      </div>
    </div>
  );
};
