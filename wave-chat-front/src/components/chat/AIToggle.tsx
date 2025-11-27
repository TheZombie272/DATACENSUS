import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bot, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface AIToggleProps {
  sessionId: string;
}

export function AIToggle({ sessionId }: AIToggleProps) {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "Session ID requerido para cambiar configuración de AI.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Integración requerida",
      description: "Para cambiar la configuración de AI, necesitas conectar tu proyecto a Supabase usando la integración nativa.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex items-center gap-3 p-4 border-b bg-chat-sidebar">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-primary" />
        <span className="font-medium">AI Assistant</span>
      </div>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {isActive ? 'Activo' : 'Inactivo'}
        </span>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Switch
            checked={isActive}
            onCheckedChange={handleToggle}
          />
        )}
      </div>
    </div>
  );
}