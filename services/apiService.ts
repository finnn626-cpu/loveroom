import { Space, Message, SpaceData } from '../types';

// API 基础 URL - 可以根据部署情况修改
const API_BASE_URL = (import.meta.env?.VITE_API_URL as string) || 'http://localhost:3001/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async createSpace(name: string, password: string): Promise<Space> {
    return this.request<Space>('/spaces', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
    });
  }

  async getSpace(id: string): Promise<SpaceData | null> {
    try {
      return await this.request<SpaceData>(`/spaces/${id}`);
    } catch (error) {
      return null;
    }
  }

  async validateSpace(id: string, password: string): Promise<boolean> {
    try {
      const result = await this.request<{ valid: boolean }>(`/spaces/${id}/validate`, {
        method: 'POST',
        body: JSON.stringify({ password }),
      });
      return result.valid;
    } catch (error) {
      return false;
    }
  }

  async addMessage(spaceId: string, message: Message): Promise<Message[]> {
    return this.request<Message[]>(`/spaces/${spaceId}/messages`, {
      method: 'POST',
      body: JSON.stringify(message),
    });
  }

  async getMessages(spaceId: string): Promise<Message[]> {
    try {
      return await this.request<Message[]>(`/spaces/${spaceId}/messages`);
    } catch (error) {
      return [];
    }
  }

  // 检查 API 是否可用
  async checkHealth(): Promise<boolean> {
    try {
      await this.request('/health');
      return true;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();

