import { api, publicApi } from "./apiClient";
import { API_ENDPOINTS } from "../constants";

export interface UrlItem {
  id: string;
  original_url: string;
  short_code: string;
  short_url: string;
  clicks: number;
  max_clicks?: number;
  has_password?: boolean;
  expires_at?: string;
  created_at: string;
  tags?: string;
  category?: string;
  comment?: string;
  custom_domain?: string;
  title?: string;
  description?: string;
  image?: string;
  is_active?: boolean;
}

export interface UrlHistoryResponse {
  data: {
    history: UrlItem[];
  };
}

export interface ShortenResult {
  data: {
    short_code: string;
    short_url: string;
    original_url: string;
    tags?: string;
    category?: string;
    comment?: string;
    custom_domain?: string;
    title?: string;
  };
}

export const shortenUrl = async (data: {
  original_url: string;
  custom_slug?: string;
  password?: string;
  max_clicks?: number;
  expires_at?: string;
  tags?: string;
  category?: string;
  comment?: string;
  custom_domain?: string;
}): Promise<ShortenResult> => {
  try {
    const response = await api.post(API_ENDPOINTS.SHORTEN, data);
    return response as unknown as ShortenResult;
  } catch (error) {
    throw error;
  }
};

export const getLinkPreview = async (url: string) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.PREVIEW}?url=${encodeURIComponent(url)}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUrlHistory = async (): Promise<UrlHistoryResponse> => {
  try {
    const response = await api.get<UrlHistoryResponse>(API_ENDPOINTS.HISTORY);
    return response as unknown as UrlHistoryResponse;
  } catch (error) {
    throw error;
  }
};

export const deleteUrl = async (shortCode: string) => {
  try {
    const response = await api.delete(`${API_ENDPOINTS.DELETE}/${shortCode}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getUrlAnalytics = async (shortCode: string) => {
  try {
    const response = await api.get(`${API_ENDPOINTS.ANALYTICS}/${shortCode}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const pingServer = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.PING);
    return response;
  } catch (error) {
    throw error;
  }
};

export const toggleUrl = async (shortCode: string) => {
  try {
    const response = await api.patch(`${API_ENDPOINTS.DELETE}/${shortCode}/toggle`);
    return response;
  } catch (error) {
    throw error;
  }
};

export interface UpdateUrlPayload {
  password?: string;
  expires_at?: string | null;
  max_clicks?: number;
  tags?: string;
  category?: string;
  comment?: string;
  is_active?: boolean;
}

export const updateUrl = async ({
  shortCode,
  data,
}: {
  shortCode: string;
  data: UpdateUrlPayload;
}) => {
  try {
    const response = await api.patch(`${API_ENDPOINTS.UPDATE}/${shortCode}`, data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyPassword = async ({
  code,
  password,
}: {
  code: string;
  password: string;
}): Promise<{ data: { redirect_url: string } }> => {
  try {
    const response = await publicApi.post(`${API_ENDPOINTS.VERIFY_PASSWORD}/${code}`, { password });
    return response as unknown as { data: { redirect_url: string } };
  } catch (error) {
    throw error;
  }
};
