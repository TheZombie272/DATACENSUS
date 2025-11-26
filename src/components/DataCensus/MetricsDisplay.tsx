import { QualityResults } from "@/types/dataQuality";
import { CriterionCard } from "./CriterionCard";

interface MetricsDisplayProps {
  results: QualityResults;
}

export const MetricsDisplay = ({ results }: MetricsDisplayProps) => {
  // Verificar que results tenga los datos esperados
  console.log("Results en MetricsDisplay:", results);

  return (
    <div className="space-y-6">
      {/* Score General */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Calidad de Datos
        </h2>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <span className="text-sm text-muted-foreground">Puntuación General:</span>
          <span className="text-xl font-bold text-foreground">
            {(results.promedioGeneral ?? 0).toFixed(1)}/10
          </span>
        </div>
      </div>

      {/* Métricas Individuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Actualidad */}
        <CriterionCard
          title="Actualidad"
          value={results.actualidad} // Esto podría ser undefined
          description="Vigencia y actualización de los datos en relación con la frecuencia declarada"
          tooltipContent="Evalúa si los datos están actualizados según la frecuencia de actualización declarada en los metadatos"
          color="blue"
          delay={0.1}
        />

        {/* Puedes agregar más criterios aquí cuando estén disponibles */}
      </div>
    </div>
  );
};