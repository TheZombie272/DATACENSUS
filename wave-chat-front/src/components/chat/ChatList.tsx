import { useState, useEffect } from 'react';
import { Chat } from '@/types/chat';
import { ApiService } from '@/services/api';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatAIToggle } from './ChatAIToggle';

interface ChatListProps {
  selectedChatId?: string;
  onChatSelect: (chat: Chat) => void;
  onSessionIdFound?: (sessionId: string) => void;
}

export function ChatList({ selectedChatId, onChatSelect, onSessionIdFound }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getChats(1, 50);
      setChats(response.chats);
      
      // Notify parent component of sessionId from first chat
      if (response.chats.length > 0 && onSessionIdFound) {
        onSessionIdFound(response.chats[0].sessionId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading chats');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const getInitials = (name?: string, phoneNumber?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return phoneNumber?.slice(-2) || '?';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">Error loading chats</p>
        <p className="text-xs text-destructive">{error}</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground">No hay chats disponibles</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onChatSelect(chat)}
            className={cn(
              "flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-chat-message-hover",
              selectedChatId === chat.id && "bg-primary/10"
            )}
          >
            <Avatar className="h-12 w-12 mr-3">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getInitials(chat.contactName, chat.phoneNumber)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-foreground truncate">
                  {chat.contactName || chat.phoneNumber}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {formatTime(chat.lastMessageTime)}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage || 'No messages'}
                </p>
                <div className="flex items-center gap-2">
                  <ChatAIToggle sessionId={chat.sessionId} />
                  {chat.unreadCount > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}