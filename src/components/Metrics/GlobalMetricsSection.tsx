import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, Users, Database, CheckCircle2 } from "lucide-react";
import { BackendGlobalMetrics } from "./BackendGlobalMetrics";
import { Separator } from "@/components/ui/separator";

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
    <div className="space-y-12">

      {/* Backend Global Metrics Section */}
      <BackendGlobalMetrics />

    </div>
  );
};
