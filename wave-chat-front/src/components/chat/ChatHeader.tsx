import { Chat } from '@/types/chat';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Video, MoreVertical } from 'lucide-react';

interface ChatHeaderProps {
  chat: Chat;
}

export function ChatHeader({ chat }: ChatHeaderProps) {
  const getInitials = (name?: string, phoneNumber?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return phoneNumber?.slice(-2) || '?';
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-chat-sidebar">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            {getInitials(chat.contactName, chat.phoneNumber)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-foreground">
            {chat.contactName || chat.phoneNumber}
          </h2>
          <p className="text-sm text-muted-foreground">
            {chat.phoneNumber}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}