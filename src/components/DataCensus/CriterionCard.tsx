import { motion } from "framer-motion";
import { ScoreGauge } from "./ScoreGauge";
import { LucideIcon } from "lucide-react";

interface CriterionCardProps {
  title: string;
  description: string;
  score: number;
  icon: LucideIcon;
  delay?: number;
}

export const CriterionCard = ({
  title,
  description,
  score,
  icon: Icon,
  delay = 0
}: CriterionCardProps) => {
  const getScoreLabel = (value: number) => {
    if (value >= 8) return { label: "Excelente", color: "text-accent" };
    if (value >= 6) return { label: "Bueno", color: "text-chart-3" };
    if (value >= 4) return { label: "Aceptable", color: "text-warning" };
    return { label: "Deficiente", color: "text-destructive" };
  };

  const scoreInfo = getScoreLabel(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">{title}</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <div>
          <div className={`text-xs font-semibold ${scoreInfo.color}`}>
            {scoreInfo.label}
          </div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {score.toFixed(1)}
            <span className="text-sm text-muted-foreground ml-1">/10</span>
          </div>
        </div>
        <ScoreGauge score={score} size="sm" showLabel={false} />
      </div>
    </motion.div>
  );
};
