import { useState } from "react";
import { DatasetInput } from "@/components/DataCensus/DatasetInput";
import { MetricsDisplay } from "@/components/DataCensus/MetricsDisplay";
import { evaluarCalidadDataset } from "@/lib/quality/dataQuality";
import { AnalysisState } from "@/types/dataQuality";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Index = () => {
  const [state, setState] = useState<AnalysisState>({
    loading: false,
    error: null,
    results: null,
    dataset: null,
    url: ""
  });

  const handleAnalyze = async (url: string) => {
    setState({ ...state, loading: true, error: null, url });
    
    toast.info("Iniciando análisis del dataset...", {
      description: "Descargando y evaluando datos"
    });

    try {
      // Simular metadatos (en producción vendría de la API o input del usuario)
      const metadata = {
        titulo: "Dataset de Datos Abiertos",
        descripcion: "Conjunto de datos públicos para análisis de calidad",
        fechaActualizacion: new Date(),
        frecuenciaActualizacion: 30,
        fuente: "datos.gov.co",
        publicador: "Gobierno de Colombia",
        contacto: "datos@gov.co",
        etiquetas: ["datos abiertos", "gobierno", "transparencia"],
        vinculo: url
      };

      const results = await evaluarCalidadDataset(url, metadata);
      
      setState({
        loading: false,
        error: null,
        results,
        dataset: null,
        url
      });

      toast.success("Análisis completado", {
        description: `Calidad general: ${results.promedioGeneral.toFixed(1)}/10`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setState({
        ...state,
        loading: false,
        error: errorMessage
      });
      
      toast.error("Error en el análisis", {
        description: errorMessage
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                DataCensus
              </h1>
              <p className="text-xs text-muted-foreground">
                Plataforma de Análisis de Calidad de Datos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Input Section */}
        <DatasetInput onAnalyze={handleAnalyze} loading={state.loading} />

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {state.loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  Analizando dataset...
                </p>
                <p className="text-sm text-muted-foreground">
                  Evaluando 17 criterios de calidad
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence mode="wait">
          {state.error && !state.loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error en el análisis</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {state.results && !state.loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MetricsDisplay results={state.results} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome State */}
        {!state.results && !state.loading && !state.error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-4"
          >
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Bienvenido a DataCensus
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Evalúa la calidad de tus datasets con 17 criterios especializados basados en
              estándares internacionales. Ingresa una URL de dataset JSON para comenzar el análisis.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">Confidencialidad</div>
              </div>
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">Completitud</div>
              </div>
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">Consistencia</div>
              </div>
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">Precisión</div>
              </div>
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">+13 más</div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-xs text-muted-foreground">
            DataCensus • Análisis de Calidad de Datos basado en ISO/IEC 25012
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
