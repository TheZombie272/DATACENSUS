import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Database, FileText, Calendar, TrendingUp, Award, BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import InfoTag from "@/components/ui/info-tag";
import {
  useMetadataQuality,
  useContentCoverage,
  useMaintenanceActivity,
  useUsageEngagement,
  useOperationalKPIs,
  useAdvancedAnalytics,
} from "@/hooks/useBackendMetrics";

export const BackendGlobalMetrics = () => {
  const metadataQuality = useMetadataQuality();
  const contentCoverage = useContentCoverage();
  const maintenanceActivity = useMaintenanceActivity();
  const usageEngagement = useUsageEngagement();
  const operationalKPIs = useOperationalKPIs();
  const advancedAnalytics = useAdvancedAnalytics();

  const isLoading = 
    metadataQuality.isLoading ||
    contentCoverage.isLoading ||
    maintenanceActivity.isLoading ||
    usageEngagement.isLoading ||
    operationalKPIs.isLoading ||
    advancedAnalytics.isLoading;

  const hasError = 
    metadataQuality.isError ||
    contentCoverage.isError ||
    maintenanceActivity.isError ||
    usageEngagement.isError ||
    operationalKPIs.isError ||
    advancedAnalytics.isError;

  if (hasError) {
    console.error("Errores en las métricas:", {
      metadataQuality: metadataQuality.error,
      contentCoverage: contentCoverage.error,
      maintenanceActivity: maintenanceActivity.error,
      usageEngagement: usageEngagement.error,
      operationalKPIs: operationalKPIs.error,
      advancedAnalytics: advancedAnalytics.error,
    });
    const firstError = metadataQuality.error || contentCoverage.error || maintenanceActivity.error || usageEngagement.error || operationalKPIs.error || advancedAnalytics.error;
    const errorMessage = firstError ? (firstError instanceof Error ? firstError.message : JSON.stringify(firstError)) : "Unknown error";
    const debugInfo = `${errorMessage}`;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert variant="destructive">
          <AlertDescription>
            Error al cargar las métricas globales del backend. Por favor, verifica que el servidor esté disponible en https://46f839ef0f6c.ngrok-free.app
            <div style={{ marginTop: 8 }}>
              <strong>Detalle (depuración):</strong>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, marginTop: 6 }}>{debugInfo}</pre>
            </div>
          </AlertDescription>
        </Alert>
      </motion.div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  const globalMetrics = [
    {
      label: "Recursos Totales",
      value: metadataQuality.data?.total_resources.toLocaleString() || "0",
      icon: Database,
      color: "blue",
      delay: 0,
    },
    {
      label: "Licencias Abiertas",
      value: `${operationalKPIs.data?.percent_open_license.toFixed(1) || "0"}%`,
      icon: Award,
      color: "green",
      delay: 0.1,
    },
    {
      label: "Total Descargas",
      value: usageEngagement.data?.total_downloads.toLocaleString() || "0",
      icon: TrendingUp,
      color: "purple",
      delay: 0.2,
    },
    {
      label: "Con Descripción",
      value: `${metadataQuality.data?.percent_with_description.toFixed(1) || "0"}%`,
      icon: FileText,
      color: "orange",
      delay: 0.3,
    },
    {
      label: "Días Promedio Actualización",
      value: Math.round(maintenanceActivity.data?.avg_update_days || 0).toString(),
      icon: Calendar,
      color: "blue",
      delay: 0.4,
    },
    {
      label: "Cumplimiento Esquema",
      value: `${operationalKPIs.data?.percent_schema_compliance.toFixed(1) || "0"}%`,
      icon: BarChart3,
      color: "green",
      delay: 0.5,
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "text-blue-600" },
      green: { bg: "bg-green-50", text: "text-green-600", icon: "text-green-600" },
      purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "text-purple-600" },
      orange: { bg: "bg-orange-50", text: "text-orange-600", icon: "text-orange-600" },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Métricas Globales
        </h2>
        <p className="text-lg text-gray-600">
          Datos consolidados del ecosistema desde el backend
        </p>
      </motion.div>

      {/* Global Metrics Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {globalMetrics.map((metric, idx) => {
          const Icon = metric.icon;
          const colors = getColorClasses(metric.color);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: metric.delay }}
            >
              <Card className="border-0 shadow-lg shadow-blue-500/5 bg-white hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
                    {/* Info tag with brief explanation for each metric */}
                    {metric.label === "Recursos Totales" && (
                      <InfoTag size="sm" title="Recursos Totales" content="Número total de recursos registrados en el catálogo que son del tipo dataset y publicos." />
                    )}
                    {metric.label === "Licencias Abiertas" && (
                      <InfoTag size="sm" title="Licencias Abiertas" content="Porcentaje de recursos que usan una licencia de uso abierta (por ejemplo: CC-BY, dominio público)." />
                    )}
                    {metric.label === "Total Descargas" && (
                      <InfoTag size="sm" title="Total Descargas" content="Suma de descargas registradas para los recursos en el periodo observado." />
                    )}
                    {metric.label === "Con Descripción" && (
                      <InfoTag size="sm" title="Con Descripción" content="Porcentaje de recursos que cuentan con una descripción textual asociada." />
                    )}
                    {metric.label === "Días Promedio Actualización" && (
                      <InfoTag size="sm" title="Días Promedio" content="Promedio de días transcurridos desde la última actualización reportada en los recursos." />
                    )}
                    {metric.label === "Cumplimiento Esquema" && (
                      <InfoTag size="sm" title="Cumplimiento de Esquema" content="Porcentaje de recursos que cumplen el esquema/especificación de metadatos esperado." />
                    )}
                  </div>
                  <p className={`text-3xl font-bold ${colors.text}`}>{metric.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Top Publishers & Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Publishers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg shadow-blue-500/5 bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Top Publicadores
              </h3>
              <div className="space-y-3">
                {contentCoverage.data?.top_publishers.slice(0, 5).map(([name, count], idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                    <span className="text-sm font-bold text-blue-600">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg shadow-blue-500/5 bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Top Categorías
              </h3>
              <div className="space-y-3">
                {contentCoverage.data?.top_categories.slice(0, 5).map(([name, count], idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{name}</span>
                    <span className="text-sm font-bold text-purple-600">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Format Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg shadow-blue-500/5 bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Distribución de Formatos
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(metadataQuality.data?.formats_distribution || {}).map(([format, count], idx) => (
                <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-sm text-gray-600 uppercase">{format}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
