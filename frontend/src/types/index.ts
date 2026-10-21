export type RiskCategory = 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical Risk';

export interface User {
  id: string;
  email: string;
  display_name?: string;
  created_at: string;
}

export interface IndicatorDetail {
  id: string;
  name: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  weight: number;
  matched_phrase: string;
  excerpt: string;
  explanation: string;
  char_start: number;
  char_end: number;
}

export interface AuthenticityResponse {
  id?: string;
  model_name: string;
  model_version: string;
  estimated_risk_score?: number;
  result_summary: string;
  limitations: string;
  acoustic_metrics: {
    sample_rate_hz?: number;
    duration_seconds?: number;
    pitch_mean_hz?: number;
    pitch_jitter_relative?: number;
    spectral_rolloff_hz?: number;
    high_frequency_ratio?: number;
    average_spectral_flatness?: number;
    zero_crossing_rate_per_sec?: number;
    [key: string]: any;
  };
  created_at?: string;
}

export interface AnalysisResponse {
  id: string;
  user_id?: string;
  original_filename: string;
  audio_duration_seconds?: number;
  detected_language: string;
  transcript: string;
  transcript_source: 'whisper_model' | 'user_edited' | 'manual_input';
  scam_risk_score: number;
  scam_risk_category: RiskCategory;
  detected_indicators: IndicatorDetail[];
  evidence_excerpts: string[];
  recommended_actions: string[];
  transcription_model: string;
  detection_method_version: string;
  processing_status: string;
  retained_audio_path?: string;
  authenticity?: AuthenticityResponse | null;
  created_at: string;
}

export interface AnalysesListResponse {
  items: AnalysisResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DashboardStatsResponse {
  total_analyses: number;
  category_counts: {
    'Critical Risk': number;
    'High Risk': number;
    'Medium Risk': number;
    'Low Risk': number;
  };
  top_indicators: { name: string; count: number }[];
  recent_analyses: AnalysisResponse[];
  success_count: number;
  failure_count: number;
  timeline: {
    date: string;
    score: number;
    category: RiskCategory;
    filename: string;
  }[];
}

export interface UserSettings {
  user_id: string;
  audio_retention_enabled: boolean;
  audio_retention_duration: number;
  updated_at: string;
}

export interface HealthResponse {
  status: string;
  app_name: string;
  version: string;
  environment: string;
  capabilities: {
    speech_to_text: {
      provider: string;
      model_size: string;
      supported_languages: string[];
      device: string;
      is_active: boolean;
    };
    scam_detection: {
      engine: string;
      version: string;
      indicator_categories: string[];
    };
    audio_authenticity: {
      enabled: boolean;
      model_name: string;
      status: string;
    };
    privacy: {
      audio_retention_default: boolean;
      storage_mode: string;
    };
    helplines: {
      india_cybercrime_portal: string;
      india_cybercrime_helpline: string;
      chakshu_portal: string;
    };
  };
}
