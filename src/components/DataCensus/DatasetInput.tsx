import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface DatasetInputProps {
  onAnalyze: (url: string) => void;
  loading: boolean;
}

export const DatasetInput = ({ onAnalyze, loading }: DatasetInputProps) => {
  const [url, setUrl] = useState("https://www.datos.gov.co/resource/hdbg-66v4.json");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Análisis de Calidad de Datos</h2>
            <p className="text-sm text-muted-foreground">
              Ingresa la URL de un dataset JSON para evaluar sus 17 criterios de calidad
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataset-url" className="text-sm font-medium">
              URL del Dataset (JSON)
            </Label>
            <div className="flex gap-2">
              <Input
                id="dataset-url"
                type="url"
                placeholder="https://www.datos.gov.co/resource/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-input border-border font-mono text-sm"
                disabled={loading}
                required
              />
              <Button
                type="submit"
                disabled={loading || !url.trim()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analizar
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Ejemplo: https://www.datos.gov.co/resource/hdbg-66v4.json
            </p>
          </div>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Nota:</strong> El análisis evalúa 17 criterios de calidad
            e interoperabilidad incluyendo confidencialidad, completitud, consistencia, relevancia,
            y más. Los resultados se presentan en una escala de 0 a 10.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
