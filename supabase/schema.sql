-- =============================================================================
-- VoiceShield AI — Supabase PostgreSQL Schema & Row Level Security (RLS) Policies
-- Information and Network Security (INS) Expo
-- =============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. User Settings Table
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    audio_retention_enabled BOOLEAN DEFAULT FALSE NOT NULL,
    audio_retention_duration INTEGER DEFAULT 7 NOT NULL, -- in days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Analyses Table
CREATE TABLE IF NOT EXISTS public.analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    original_filename TEXT NOT NULL,
    audio_duration_seconds NUMERIC(10, 2),
    detected_language TEXT DEFAULT 'en',
    transcript TEXT NOT NULL,
    transcript_source TEXT DEFAULT 'whisper_model', -- 'whisper_model' | 'user_edited' | 'manual_input'
    scam_risk_score NUMERIC(5, 2) NOT NULL, -- 0.00 to 100.00
    scam_risk_category TEXT NOT NULL,       -- 'Low Risk' | 'Medium Risk' | 'High Risk' | 'Critical Risk'
    detected_indicators JSONB NOT NULL DEFAULT '[]'::jsonb,
    evidence_excerpts JSONB NOT NULL DEFAULT '[]'::jsonb,
    recommended_actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    transcription_model TEXT DEFAULT 'faster-whisper-tiny',
    detection_method_version TEXT DEFAULT 'VoiceShield-Rules-v1.0',
    processing_status TEXT DEFAULT 'completed', -- 'processing' | 'completed' | 'failed'
    retained_audio_path TEXT, -- NULL by default unless audio_retention_enabled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Audio Authenticity Results Table (Separate experimental synthetic-speech module)
CREATE TABLE IF NOT EXISTS public.audio_authenticity_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    analysis_id UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    estimated_risk_score NUMERIC(5, 2), -- 0.00 to 100.00
    result_summary TEXT NOT NULL,
    limitations TEXT NOT NULL,
    acoustic_metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analyses_category ON public.analyses(scam_risk_category);
CREATE INDEX IF NOT EXISTS idx_authenticity_analysis_id ON public.audio_authenticity_results(analysis_id);

-- =============================================================================
-- Row Level Security (RLS) Policies
-- Enforce user isolation: Users can ONLY access their own records
-- =============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audio_authenticity_results ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- User Settings RLS
CREATE POLICY "Users can view own settings"
    ON public.user_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
    ON public.user_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
    ON public.user_settings FOR UPDATE
    USING (auth.uid() = user_id);

-- Analyses RLS
CREATE POLICY "Users can view own analyses"
    ON public.analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
    ON public.analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analyses"
    ON public.analyses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses"
    ON public.analyses FOR DELETE
    USING (auth.uid() = user_id);

-- Audio Authenticity Results RLS (via analyses table user_id)
CREATE POLICY "Users can view own audio authenticity results"
    ON public.audio_authenticity_results FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.analyses a
            WHERE a.id = audio_authenticity_results.analysis_id
            AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own audio authenticity results"
    ON public.audio_authenticity_results FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.analyses a
            WHERE a.id = audio_authenticity_results.analysis_id
            AND a.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete own audio authenticity results"
    ON public.audio_authenticity_results FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.analyses a
            WHERE a.id = audio_authenticity_results.analysis_id
            AND a.user_id = auth.uid()
        )
    );

-- Trigger for new auth.users signup to create profile and default user_settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);

    INSERT INTO public.user_settings (user_id, audio_retention_enabled, audio_retention_duration)
    VALUES (NEW.id, FALSE, 7);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
