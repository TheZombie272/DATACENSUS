import { useState, useEffect, useRef } from 'react';
import { Message, Chat } from '@/types/chat';
import { ApiService } from '@/services/api';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageListProps {
  chat: Chat;
}

export function MessageList({ chat }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chat.id) {
      loadMessages();
    }
  }, [chat.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getMessages(chat.id, 1, 100);
      setMessages(response.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading messages');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      <div className="flex items-center justify-center h-full">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-4" ref={scrollRef}>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.isFromUser ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] px-3 py-2 rounded-2xl shadow-sm",
                message.isFromUser
                  ? "bg-chat-message-received text-foreground rounded-bl-sm"
                  : "bg-chat-message-sent text-white rounded-br-sm"
              )}
            >
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
              <p className={cn(
                "text-xs mt-1 text-right",
                message.isFromUser ? "text-muted-foreground" : "text-white/70"
              )}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}