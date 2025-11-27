import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Bot, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChatAIToggleProps {
  sessionId: string;
}

export function ChatAIToggle({ sessionId }: ChatAIToggleProps) {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAISettings();
  }, [sessionId]);

  const loadAISettings = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_settings')
        .select('active_ai')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error) throw error;
      setIsActive(data?.active_ai || false);
    } catch (error) {
      console.error('Error loading AI settings:', error);
    }
  };

  const handleToggle = async () => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "Session ID requerido para cambiar configuración de AI.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const newValue = !isActive;
      
      const { error } = await supabase
        .from('ai_settings')
        .upsert({
          session_id: sessionId,
          active_ai: newValue,
        });

      if (error) throw error;

      setIsActive(newValue);
      toast({
        title: "Configuración actualizada",
        description: `AI ${newValue ? 'activado' : 'desactivado'} para esta sesión.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración de AI.",
        variant: "destructive",
      });
      console.error('Error updating AI settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <Bot className="h-4 w-4 text-primary" />
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Switch
          checked={isActive}
          onCheckedChange={handleToggle}
        />
      )}
    </div>
  );
}