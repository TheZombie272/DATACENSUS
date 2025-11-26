import { useState, useEffect } from "react";
import { MetricsDisplay } from "@/components/DataCensus/MetricsDisplay";
import { QualityResults } from "@/types/dataQuality";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Search, Database } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE_URL = "http://localhost:8001";

const CRITERIA_ENDPOINTS = [
  "actualidad"
];

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QualityResults | null>(null);
  const [datasetInfo, setDatasetInfo] = useState<{
    dataset_id?: string;
    dataset_name?: string; 
    rows?: number; 
    columns?: number;
    records_count?: number;
  }>({});
  const [datasetInput, setDatasetInput] = useState("8dbv-wsjq"); // Valor por defecto
  const [analysisStarted, setAnalysisStarted] = useState(false);

  // Verificar si el servidor está activo
  const checkServerStatus = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/`);
      return response.ok;
    } catch (error) {
      console.error("Servidor no disponible:", error);
      return false;
    }
  };

  const initializeDataset = async (datasetId: string): Promise<boolean> => {
    setInitializing(true);
    setError(null);
    setResults(null);
    
    toast.info("Inicializando dataset...", {
      description: `Cargando datos para ID: ${datasetId}`
    });

    try {
      const response = await fetch(`${API_BASE_URL}/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataset_id: datasetId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al inicializar el dataset");
      }
      
      const data = await response.json();
      setDatasetInfo({
        dataset_id: data.dataset_id,
        dataset_name: data.dataset_name,
        rows: data.rows,
        columns: data.columns,
        records_count: data.records_count
      });
      
      setInitializing(false);
      
      toast.success("Dataset cargado exitosamente", {
        description: `✅ ${data.records_count} registros obtenidos • ${data.rows} filas × ${data.columns} columnas`
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al conectar con el servidor";
      setError(errorMessage);
      setInitializing(false);
      
      toast.error("Error al cargar dataset", {
        description: errorMessage
      });
      return false;
    }
  };

  const fetchAllMetrics = async () => {
    setLoading(true);
    setError(null);
    
    toast.info("Calculando métricas de calidad...", {
      description: "Evaluando criterio de actualidad"
    });

    try {
      const promises = CRITERIA_ENDPOINTS.map(async (criterion) => {
        const response = await fetch(`${API_BASE_URL}/${criterion}`);
        if (!response.ok) {
          throw new Error(`Error al obtener ${criterion}: ${response.statusText}`);
        }
        const data = await response.json();
        return { criterion, value: data.score || 0 };
      });

      const metricsArray = await Promise.all(promises);
      
      console.log("Métricas obtenidas del backend:", metricsArray);
      
      const metricsObj: any = {};
      metricsArray.forEach(({ criterion, value }) => {
        metricsObj[criterion] = value;
      });

      const promedio = metricsArray.length > 0 ? metricsArray[0].value : 0;
      metricsObj.promedioGeneral = promedio;

      console.log("Objeto final de métricas:", metricsObj);

      setResults(metricsObj as QualityResults);
      setLoading(false);

      toast.success("Análisis completado", {
        description: `📊 Actualidad: ${promedio.toFixed(1)}/10`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al conectar con el servidor";
      setError(errorMessage);
      setLoading(false);
      
      toast.error("Error al calcular métricas", {
        description: errorMessage
      });
    }
  };

  const handleAnalyze = async () => {
    if (!datasetInput.trim()) {
      toast.error("Error", {
        description: "Por favor ingresa un ID de dataset válido"
      });
      return;
    }

    setAnalysisStarted(true);
    
    // Primero verificar que el servidor esté activo
    const serverActive = await checkServerStatus();
    if (!serverActive) {
      setError("El servidor backend no está disponible. Asegúrate de que esté ejecutándose en el puerto 8001.");
      toast.error("Servidor no disponible");
      return;
    }

    // Inicializar dataset y calcular métricas
    const initialized = await initializeDataset(datasetInput.trim());
    if (initialized) {
      await fetchAllMetrics();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatasetInput(e.target.value);
    // Resetear estado si el usuario cambia el ID
    if (analysisStarted) {
      setAnalysisStarted(false);
      setResults(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Database className="w-6 h-6 text-primary" />
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
            {datasetInfo.dataset_name && analysisStarted && (
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {datasetInfo.dataset_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: {datasetInfo.dataset_id} • {datasetInfo.records_count} registros
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Input Section */}
        <Card className="bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Análisis de Dataset
            </CardTitle>
            <CardDescription>
              Ingresa el ID de un dataset de datos.gov.co para analizar su calidad
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Ej: 8dbv-wsjq"
                value={datasetInput}
                onChange={handleInputChange}
                className="flex-1"
                disabled={initializing || loading}
              />
              <Button 
                onClick={handleAnalyze}
                disabled={initializing || loading || !datasetInput.trim()}
                className="gap-2"
              >
                {(initializing || loading) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Ver Métricas
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              El ID del dataset se encuentra en la URL de datos.gov.co. Ejemplo: https://www.datos.gov.co/resource/<strong>8dbv-wsjq</strong>.json
            </p>
          </CardContent>
        </Card>

        {/* Initializing State */}
        <AnimatePresence mode="wait">
          {initializing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  Cargando dataset...
                </p>
                <p className="text-sm text-muted-foreground">
                  Obteniendo datos y metadatos para {datasetInput}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {loading && !initializing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="text-center">
                <p className="text-lg font-semibold text-foreground">
                  Calculando métricas...
                </p>
                <p className="text-sm text-muted-foreground">
                  Evaluando criterios de calidad de datos
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence mode="wait">
          {error && !loading && !initializing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error en el análisis</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {results && !loading && !initializing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MetricsDisplay results={results} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Welcome State */}
        {!analysisStarted && !loading && !initializing && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-4"
          >
            <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
              <Database className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Bienvenido a DataCensus
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Analiza la calidad de datasets públicos de datos.gov.co. 
              Ingresa el ID del dataset y obtén métricas de calidad en tiempo real.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">Dataset ID: 8dbv-wsjq</div>
              </div>
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">Actualidad</div>
              </div>
              <div className="px-4 py-2 bg-card border border-border rounded-lg">
                <div className="text-xs text-muted-foreground">+17 criterios</div>
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


// import { useState, useEffect } from "react";
// import { MetricsDisplay } from "@/components/DataCensus/MetricsDisplay";
// import { QualityResults } from "@/types/dataQuality";
// import { toast } from "sonner";
// import { motion, AnimatePresence } from "framer-motion";
// import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// const API_BASE_URL = "http://localhost:8000";

// const CRITERIA_ENDPOINTS = [
//   // "confidencialidad",
//   // "relevancia",
//   "actualidad",
//   // "trazabilidad",
//   // "conformidad",
//   // "exactitudSintactica",
//   // "exactitudSemantica",
//   // "completitud",
//   // "consistencia",
//   // "precision",
//   // "portabilidad",
//   // "credibilidad",
//   // "comprensibilidad",
//   // "accesibilidad",
//   // "unicidad",
//   // "eficiencia",
//   // "recuperabilidad",
//   // "disponibilidad"
// ];

// const Index = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [results, setResults] = useState<QualityResults | null>(null);

//   const fetchAllMetrics = async () => {
//     setLoading(true);
//     setError(null);
    
//     toast.info("Obteniendo métricas de calidad...", {
//       description: "Consultando criterio de actualidad desde el servidor"
//     });

//     try {
//       const promises = CRITERIA_ENDPOINTS.map(async (criterion) => {
//         const response = await fetch(`${API_BASE_URL}/${criterion}`);
//         if (!response.ok) {
//           throw new Error(`Error al obtener ${criterion}: ${response.statusText}`);
//         }
//         const data = await response.json();
//         return { criterion, value: data.value || data.score || 0 };
//       });

//       const metricsArray = await Promise.all(promises);
      
//       const metricsObj: any = {};
//       metricsArray.forEach(({ criterion, value }) => {
//         metricsObj[criterion] = value;
//       });

//       const promedio = metricsArray.reduce((sum, m) => sum + m.value, 0) / metricsArray.length;
//       metricsObj.promedioGeneral = promedio;

//       setResults(metricsObj as QualityResults);
//       setLoading(false);

//       toast.success("Métrica obtenida exitosamente", {
//         description: `Actualidad: ${promedio.toFixed(1)}/10`
//       });
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "Error al conectar con el servidor";
//       setError(errorMessage);
//       setLoading(false);
      
//       toast.error("Error al obtener métricas", {
//         description: errorMessage
//       });
//     }
//   };

//   useEffect(() => {
//     fetchAllMetrics();
//   }, []);

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <CheckCircle2 className="w-6 h-6 text-primary" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-foreground tracking-tight">
//                 DataCensus
//               </h1>
//               <p className="text-xs text-muted-foreground">
//                 Plataforma de Análisis de Calidad de Datos
//               </p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8 space-y-8">
//         {/* Loading State */}
//         <AnimatePresence mode="wait">
//           {loading && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex flex-col items-center justify-center py-16 gap-4"
//             >
//               <Loader2 className="w-12 h-12 text-primary animate-spin" />
//               <div className="text-center">
//                 <p className="text-lg font-semibold text-foreground">
//                   Analizando dataset...
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   Evaluando criterio de actualidad
//                 </p>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Error State */}
//         <AnimatePresence mode="wait">
//           {error && !loading && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <Alert variant="destructive">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>Error al obtener métricas</AlertTitle>
//                 <AlertDescription>{error}</AlertDescription>
//               </Alert>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Results */}
//         <AnimatePresence mode="wait">
//           {results && !loading && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//             >
//               <MetricsDisplay results={results} />
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Welcome State */}
//         {!results && !loading && !error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-16 space-y-4"
//           >
//             <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
//               <CheckCircle2 className="w-12 h-12 text-primary" />
//             </div>
//             <h2 className="text-2xl font-bold text-foreground">
//               Bienvenido a DataCensus
//             </h2>
//             <p className="text-muted-foreground max-w-2xl mx-auto">
//               Visualiza métricas de calidad de datos en tiempo real desde tu servidor local.
//               Las métricas se actualizan automáticamente al cargar la página.
//             </p>
//             <div className="flex flex-wrap gap-3 justify-center pt-4">
//               <div className="px-4 py-2 bg-card border border-border rounded-lg">
//                 <div className="text-xs text-muted-foreground">Actualidad</div>
//               </div>
//               {/* <div className="px-4 py-2 bg-card border border-border rounded-lg">
//                 <div className="text-xs text-muted-foreground">Completitud</div>
//               </div>
//               <div className="px-4 py-2 bg-card border border-border rounded-lg">
//                 <div className="text-xs text-muted-foreground">Consistencia</div>
//               </div>
//               <div className="px-4 py-2 bg-card border border-border rounded-lg">
//                 <div className="text-xs text-muted-foreground">Precisión</div>
//               </div>
//               <div className="px-4 py-2 bg-card border border-border rounded-lg">
//                 <div className="text-xs text-muted-foreground">+16 más</div>
//               </div> */}
//             </div>
//           </motion.div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="border-t border-border bg-card/30 mt-16">
//         <div className="container mx-auto px-4 py-6">
//           <p className="text-center text-xs text-muted-foreground">
//             DataCensus • Análisis de Calidad de Datos basado en ISO/IEC 25012
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Index;