import { useState } from 'react';
import { Chat } from '@/types/chat';
import { ChatList } from '@/components/chat/ChatList';
import { MessageList } from '@/components/chat/MessageList';
import { MessageInput } from '@/components/chat/MessageInput';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageCircle } from 'lucide-react';

const Index = () => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleMessageSent = () => {
    // Optionally refresh messages or update UI
  };

  const handleSessionIdFound = (newSessionId: string) => {
    setSessionId(newSessionId);
  };

  return (
    <div className="flex h-screen bg-chat-bg">
      {/* Sidebar */}
      <div className="w-80 bg-chat-sidebar border-r border-whatsapp-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-primary">
          <div className="flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-primary-foreground" />
            <h1 className="text-xl font-bold text-primary-foreground">WhatsApp Manager</h1>
          </div>
          {sessionId && (
            <p className="text-sm text-primary-foreground/80 mt-2">
              Sesión activa: {sessionId}
            </p>
          )}
        </div>

        {/* Chat List */}
        <div className="flex-1">
          <ChatList
            selectedChatId={selectedChat?.id}
            onChatSelect={handleChatSelect}
            onSessionIdFound={handleSessionIdFound}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <ChatHeader chat={selectedChat} />
            <div className="flex-1 bg-chat-bg">
              <MessageList chat={selectedChat} />
            </div>
            <MessageInput
              chat={selectedChat}
              sessionId={sessionId || selectedChat.sessionId}
              onMessageSent={handleMessageSent}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-chat-bg">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Selecciona un chat
              </h2>
              <p className="text-muted-foreground">
                Elige una conversación de la lista para empezar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
