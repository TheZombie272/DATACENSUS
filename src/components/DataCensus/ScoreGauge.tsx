import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ScoreGauge = ({ score, size = "md", showLabel = true }: ScoreGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const getColor = (value: number) => {
    if (value >= 8) return "hsl(var(--accent))"; // Verde
    if (value >= 6) return "hsl(var(--chart-3))"; // Amarillo
    if (value >= 4) return "hsl(var(--warning))"; // Naranja
    return "hsl(var(--destructive))"; // Rojo
  };

  const sizes = {
    sm: { width: 60, height: 60, stroke: 4, fontSize: "text-sm" },
    md: { width: 80, height: 80, stroke: 6, fontSize: "text-base" },
    lg: { width: 120, height: 120, stroke: 8, fontSize: "text-2xl" }
  };

  const { width, height, stroke, fontSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 10) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
            fill="none"
          />
          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={height / 2}
            r={radius}
            stroke={getColor(animatedScore)}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              filter: `drop-shadow(0 0 8px ${getColor(animatedScore)})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={`font-bold font-mono ${fontSize}`}
            style={{ color: getColor(animatedScore) }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {animatedScore.toFixed(1)}
          </motion.span>
        </div>
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground font-medium">
          / 10.0
        </span>
      )}
    </div>
  );
};
