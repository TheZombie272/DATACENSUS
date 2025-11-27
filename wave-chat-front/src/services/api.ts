import { ChatResponse, MessageResponse, Message } from '@/types/chat';

const API_BASE_URL = 'http://localhost:3000'; // Adjust this to your backend URL

export class ApiService {
  static async getChats(page = 1, limit = 20, sessionId?: string): Promise<ChatResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (sessionId) {
      params.append('sessionId', sessionId);
    }

    const response = await fetch(`${API_BASE_URL}/api/chats?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chats: ${response.statusText}`);
    }
    return response.json();
  }

  static async getMessages(chatId: string, page = 1, limit = 50): Promise<MessageResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/messages?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    return response.json();
  }

  static async sendMessage(chatId: string, content: string, sessionId: string): Promise<Message> {
    const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, sessionId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }
    return response.json();
  }
}