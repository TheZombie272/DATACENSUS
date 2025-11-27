export interface Chat {
  id: string;
  phoneNumber: string;
  contactName?: string;
  lastMessage?: string;
  lastMessageTime: string;
  unreadCount: number;
  sessionId: string;
}

export interface Message {
  id: string;
  chatId: string;
  content: string;
  isFromUser: boolean;
  timestamp: string;
  sessionId: string;
}

export interface ChatResponse {
  chats: Chat[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MessageResponse {
  messages: Message[];
  chat: Chat;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}