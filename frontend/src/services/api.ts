import {
  AnalysisResponse,
  AnalysesListResponse,
  DashboardStatsResponse,
  HealthResponse,
  User,
  UserSettings,
  RiskCategory
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('voiceshield_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `Server error (${res.status})`;
    try {
      const data = await res.json();
      if (data.detail) {
        if (typeof data.detail === 'string') {
          errorMsg = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMsg = data.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
        }
      }
    } catch {
      // not JSON
    }
    throw new Error(errorMsg);
  }
  return res.json();
}

export const api = {
  // Health
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse<HealthResponse>(res);
  },

  // Auth
  async register(email: string, password: string, displayName?: string): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, display_name: displayName })
    });
    return handleResponse(res);
  },

  async login(email: string, password: string): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<User>(res);
  },

  // Analysis
  async analyzeAudio(formData: FormData): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData
    });
    return handleResponse<AnalysisResponse>(res);
  },

  async analyzeTranscript(
    transcript: string,
    language: string = 'en',
    originalFilename: string = 'manual_transcript.txt'
  ): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE}/analyze-transcript`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({
        transcript,
        language,
        original_filename: originalFilename
      })
    });
    return handleResponse<AnalysisResponse>(res);
  },

  // History & Management
  async getAnalyses(
    page = 1,
    pageSize = 10,
    category?: RiskCategory,
    search?: string
  ): Promise<AnalysesListResponse> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize)
    });
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE}/analyses?${params.toString()}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<AnalysesListResponse>(res);
  },

  async getAnalysis(id: string): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE}/analyses/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<AnalysisResponse>(res);
  },

  async deleteAnalysis(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/analyses/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) {
      throw new Error(`Failed to delete analysis (${res.status})`);
    }
  },

  async deleteAllAnalyses(): Promise<void> {
    const res = await fetch(`${API_BASE}/analyses`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) {
      throw new Error(`Failed to delete all analyses (${res.status})`);
    }
  },

  async getDashboardStats(): Promise<DashboardStatsResponse> {
    const res = await fetch(`${API_BASE}/analyses/stats/dashboard`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<DashboardStatsResponse>(res);
  },

  async downloadPdfReport(id: string, filename = 'voiceshield_incident_report.pdf'): Promise<void> {
    const res = await fetch(`${API_BASE}/analyses/${id}/pdf`, {
      headers: { ...getAuthHeader() }
    });
    if (!res.ok) throw new Error('Failed to generate PDF report');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  // Settings
  async getSettings(): Promise<UserSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse<UserSettings>(res);
  },

  async updateSettings(data: { audio_retention_enabled?: boolean; audio_retention_duration?: number }): Promise<UserSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse<UserSettings>(res);
  }
};
