import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, Users, Database, CheckCircle2 } from "lucide-react";

export const GlobalMetricsSection = () => {
  const globalStats = [
    {
      label: "Datasets Analizados",
      value: "1,247",
      change: "+12.5%",
      icon: Database,
      color: "blue",
      delay: 0
    },
    {
      label: "Puntuación Promedio",
      value: "7.8/10",
      change: "+0.3",
      icon: TrendingUp,
      color: "green",
      delay: 0.1
    },
    {
      label: "Instituciones Participantes",
      value: "48",
      change: "+8",
      icon: Users,
      color: "purple",
      delay: 0.2
    },
    {
      label: "Cumplimiento Normativo",
      value: "92%",
      change: "+5%",
      icon: CheckCircle2,
      color: "orange",
      delay: 0.3
    }
  ];

  const topDatasets = [
    { name: "SIARE - Datos Ambientales", score: 9.2, improvement: "+1.2" },
    { name: "MinTIC - Conectividad", score: 8.9, improvement: "+0.8" },
    { name: "DANE - Censos", score: 8.7, improvement: "+0.5" },
    { name: "MinSalud - Epidemiología", score: 8.3, improvement: "+0.3" },
    { name: "DNE - Energía", score: 8.1, improvement: "+0.2" }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      blue: { bg: "bg-blue-50", text: "text-[#2962FF]", icon: "text-[#2962FF]" },
      green: { bg: "bg-green-50", text: "text-green-600", icon: "text-green-600" },
      purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "text-purple-600" },
      orange: { bg: "bg-orange-50", text: "text-orange-600", icon: "text-orange-600" }
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Métricas Globales de Calidad
        </h1>
        <p className="text-lg text-gray-600">
          Visión consolidada del ecosistema de datos en Colombia
        </p>
      </motion.div>

      {/* Global Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {globalStats.map((stat, idx) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: stat.delay }}
            >
              <Card className="border-0 shadow-lg shadow-blue-500/5 bg-white hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${colors.text}`}>{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Top Datasets Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#2962FF]" />
            Datasets Destacados
          </h2>
          <p className="text-gray-600 mt-1">Los datasets con mayor puntuación de calidad</p>
        </div>

        <div className="space-y-3">
          {topDatasets.map((dataset, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
            >
              <Card className="border-0 shadow-lg shadow-blue-500/5 bg-white hover:shadow-lg hover:shadow-blue-500/10 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{dataset.name}</h3>
                      <div className="flex gap-3 items-center">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(dataset.score / 10) * 100}%` }}
                            transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                            className="h-full bg-gradient-to-r from-[#2962FF] to-[#1E4ED8]"
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{dataset.score}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <span className="inline-block text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        {dataset.improvement}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg shadow-blue-500/5 bg-white">
          <CardContent className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Tendencia de Calidad de Datos (últimos 6 meses)
            </h3>
            <div className="h-80 flex items-center justify-center bg-gradient-to-b from-blue-50 to-transparent rounded-lg">
              <div className="text-center">
                <Database className="w-12 h-12 text-[#2962FF]/20 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Gráfico de tendencias en desarrollo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Normative Compliance Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compliance Standards */}
          <Card className="border-0 shadow-lg shadow-blue-500/5 bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Cumplimiento de Estándares
              </h3>
              <div className="space-y-3">
                {[
                  { name: "ISO/IEC 25012", compliance: 94 },
                  { name: "ISO/IEC 8601", compliance: 89 },
                  { name: "GDPR", compliance: 87 },
                  { name: "Ley 1581/2016", compliance: 91 }
                ].map((standard, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{standard.name}</span>
                      <span className="text-sm font-semibold text-[#2962FF]">{standard.compliance}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${standard.compliance}%` }}
                        transition={{ duration: 1.5, delay: 0.5 + idx * 0.1 }}
                        className="h-full bg-gradient-to-r from-[#2962FF] to-[#1E4ED8]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-lg shadow-blue-500/5 bg-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Actividad Reciente
              </h3>
              <div className="space-y-4">
                {[
                  { event: "Nuevo dataset registrado", time: "Hace 2 horas", icon: "📊" },
                  { event: "Análisis completado", time: "Hace 4 horas", icon: "✓" },
                  { event: "Actualización de métricas", time: "Hace 6 horas", icon: "🔄" },
                  { event: "Alerta de calidad", time: "Hace 1 día", icon: "⚠️" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start pb-3 border-b border-gray-100 last:border-0">
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.event}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};
