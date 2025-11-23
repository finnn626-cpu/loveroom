import { Space, Message, SpaceData } from '../types';
import { apiService } from './apiService';

const SPACE_PREFIX = 'loveroom_data_';

// 缓存 API 可用性检查结果
let apiAvailableCache: boolean | null = null;
let lastApiCheck = 0;
const API_CHECK_INTERVAL = 30000; // 30秒检查一次

// 检查是否使用 API 模式
const useApi = async (): Promise<boolean> => {
  const now = Date.now();
  
  // 如果缓存未过期，直接返回
  if (apiAvailableCache !== null && (now - lastApiCheck) < API_CHECK_INTERVAL) {
    return apiAvailableCache;
  }
  
  // 检查 API 可用性
  try {
    apiAvailableCache = await apiService.checkHealth();
    lastApiCheck = now;
    return apiAvailableCache;
  } catch {
    apiAvailableCache = false;
    lastApiCheck = now;
    return false;
  }
};

export const StorageService = {
  createSpace: async (name: string, password: string): Promise<Space> => {
    // 尝试使用 API，如果失败则使用 localStorage
    const apiAvailable = await useApi();
    
    if (apiAvailable) {
      try {
        return await apiService.createSpace(name, password);
      } catch (error) {
        console.warn('API failed, falling back to localStorage:', error);
      }
    }
    
    // 降级到 localStorage
    const id = Math.random().toString(36).substring(2, 11);
    const newSpace: SpaceData = {
      id,
      name,
      password,
      created: Date.now(),
      messages: [
        {
          id: 'init',
          senderId: 'system',
          senderName: '系统',
          content: `欢迎来到属于你们的"${name}"空间！开始分享你们的日常吧。`,
          timestamp: Date.now(),
          type: 'system'
        }
      ]
    };
    try {
      localStorage.setItem(`${SPACE_PREFIX}${id}`, JSON.stringify(newSpace));
    } catch (error) {
      console.error('Failed to save space to localStorage:', error);
    }
    return { id, name, password, created: newSpace.created };
  },

  getSpace: async (id: string): Promise<SpaceData | null> => {
    // 尝试使用 API
    const apiAvailable = await useApi();
    
    if (apiAvailable) {
      try {
        const space = await apiService.getSpace(id);
        if (space) {
          // 同时缓存到 localStorage 作为备份
          try {
            localStorage.setItem(`${SPACE_PREFIX}${id}`, JSON.stringify(space));
          } catch (e) {
            // 忽略缓存错误
          }
          return space;
        }
      } catch (error) {
        console.warn('API failed, falling back to localStorage:', error);
      }
    }
    
    // 降级到 localStorage
    try {
      const data = localStorage.getItem(`${SPACE_PREFIX}${id}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to read space from localStorage:', error);
      return null;
    }
  },

  validateSpace: async (id: string, password: string): Promise<boolean> => {
    // 尝试使用 API
    const apiAvailable = await useApi();
    
    if (apiAvailable) {
      try {
        return await apiService.validateSpace(id, password);
      } catch (error) {
        console.warn('API failed, falling back to localStorage:', error);
      }
    }
    
    // 降级到 localStorage
    const space = await StorageService.getSpace(id);
    if (!space) {
      return false;
    }
    // 确保密码匹配（去除空格后比较）
    const storedPassword = (space.password || '').trim();
    const inputPassword = (password || '').trim();
    return storedPassword === inputPassword && storedPassword.length > 0;
  },

  addMessage: async (spaceId: string, message: Message): Promise<Message[]> => {
    // 尝试使用 API
    const apiAvailable = await useApi();
    
    if (apiAvailable) {
      try {
        return await apiService.addMessage(spaceId, message);
      } catch (error) {
        console.warn('API failed, falling back to localStorage:', error);
      }
    }
    
    // 降级到 localStorage
    const space = await StorageService.getSpace(spaceId);
    if (space) {
      space.messages.push(message);
      try {
        localStorage.setItem(`${SPACE_PREFIX}${spaceId}`, JSON.stringify(space));
      } catch (error) {
        console.error('Failed to save message to localStorage:', error);
      }
      return space.messages;
    }
    return [];
  },

  getMessages: async (spaceId: string): Promise<Message[]> => {
    // 尝试使用 API
    const apiAvailable = await useApi();
    
    if (apiAvailable) {
      try {
        return await apiService.getMessages(spaceId);
      } catch (error) {
        console.warn('API failed, falling back to localStorage:', error);
      }
    }
    
    // 降级到 localStorage
    const space = await StorageService.getSpace(spaceId);
    return space ? space.messages : [];
  }
};