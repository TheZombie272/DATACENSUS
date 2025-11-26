import { QualityResults, DatasetMetadata } from "@/types/dataQuality";

/**
 * Motor principal de análisis de calidad de datos
 * Implementa los 17 criterios de calidad e interoperabilidad
 */

// Palabras clave para detección de datos sensibles (confidencialidad)
const SENSITIVE_KEYWORDS = [
  'documento', 'cedula', 'dni', 'pasaporte', 'telefono', 'celular',
  'email', 'correo', 'cuenta_bancaria', 'tarjeta', 'salario', 'sueldo',
  'direccion', 'domicilio', 'password', 'clave', 'token', 'ssn'
];

/**
 * 1. CONFIDENCIALIDAD (3.2)
 * Evalúa el riesgo de publicar datos sensibles
 */
function calcularConfidencialidad(data: any[]): number {
  if (!data.length) return 10;
  
  const columnas = Object.keys(data[0]);
  const dfColumnas = columnas.length;
  
  let numColConfidencial = 0;
  let riesgoTotal = 0;
  
  columnas.forEach(col => {
    const colLower = col.toLowerCase();
    let riesgo = 0;
    
    // Alto riesgo (3)
    if (SENSITIVE_KEYWORDS.slice(0, 6).some(k => colLower.includes(k))) {
      riesgo = 3;
    }
    // Medio riesgo (2)
    else if (SENSITIVE_KEYWORDS.slice(6, 12).some(k => colLower.includes(k))) {
      riesgo = 2;
    }
    // Bajo riesgo (1)
    else if (SENSITIVE_KEYWORDS.slice(12).some(k => colLower.includes(k))) {
      riesgo = 1;
    }
    
    if (riesgo > 0) {
      numColConfidencial++;
      riesgoTotal += riesgo;
    }
  });
  
  if (numColConfidencial === 0) return 10;
  
  const confidencialidad = 10 - (numColConfidencial / dfColumnas) * (riesgoTotal / (numColConfidencial * 3)) * 10;
  return Math.max(0, Math.min(10, confidencialidad));
}

/**
 * 2. RELEVANCIA (3.3)
 * Mide el valor y utilidad de los datos
 */
function calcularRelevancia(data: any[], metadata?: DatasetMetadata): number {
  const numFilas = data.length;
  const numColumnas = Object.keys(data[0] || {}).length;
  
  // Medida de filas (mínimo 50 filas recomendado)
  const medidaFilas = numFilas >= 50 ? 10 : (numFilas / 50) * 10;
  
  // Medida de categoría (simplificada: basada en presencia de descripción)
  let medidaCategoria = 5; // Base
  if (metadata?.descripcion && metadata.descripcion.length > 50) {
    medidaCategoria = 10;
  } else if (metadata?.descripcion) {
    medidaCategoria = 7;
  }
  
  return (medidaCategoria + medidaFilas) / 2;
}

/**
 * 3. ACTUALIDAD (3.4)
 * Evalúa la vigencia de los datos
 */
function calcularActualidad(metadata?: DatasetMetadata): number {
  if (!metadata?.fechaActualizacion || !metadata?.frecuenciaActualizacion) {
    return 5; // Neutral si no hay metadatos
  }
  
  const fechaActual = new Date();
  const fechaActualizacion = new Date(metadata.fechaActualizacion);
  const diasDiferencia = (fechaActual.getTime() - fechaActualizacion.getTime()) / (1000 * 60 * 60 * 24);
  
  return diasDiferencia <= metadata.frecuenciaActualizacion ? 10 : 0;
}

/**
 * 4. TRAZABILIDAD (3.5)
 * Mide la proporción de metadatos diligenciados
 */
function calcularTrazabilidad(metadata?: DatasetMetadata): number {
  const metadatosClave = [
    metadata?.fechaActualizacion,
    metadata?.fuente,
    metadata?.publicador,
    metadata?.contacto,
    metadata?.descripcion
  ];
  
  const diligenciados = metadatosClave.filter(m => m).length;
  const total = metadatosClave.length;
  const proporcion = diligenciados / total;
  
  // Penalización no lineal
  const missingProportion = 1 - proporcion;
  const medidaPropMetaDiligenciados = 10 * (1 - Math.pow(missingProportion, 2));
  
  // Simplificado: sin auditoría externa
  return medidaPropMetaDiligenciados * 0.75 + 5 * 0.25;
}

/**
 * 5. CONFORMIDAD (3.6)
 * Evalúa adhesión a formatos y estándares
 */
function calcularConformidad(data: any[]): number {
  if (!data.length) return 10;
  
  const columnas = Object.keys(data[0]);
  let totalErrores = 0;
  let totalCeldas = 0;
  
  columnas.forEach(col => {
    data.forEach(row => {
      totalCeldas++;
      const valor = row[col];
      
      // Detectar errores de formato comunes
      if (col.toLowerCase().includes('año') || col.toLowerCase().includes('year')) {
        if (valor && isNaN(Number(valor))) totalErrores++;
      }
      if (col.toLowerCase().includes('fecha') || col.toLowerCase().includes('date')) {
        if (valor && isNaN(Date.parse(valor))) totalErrores++;
      }
    });
  });
  
  const proporcionErrores = totalCeldas > 0 ? totalErrores / totalCeldas : 0;
  return Math.max(0, Math.min(10, Math.exp(-5 * proporcionErrores) * 10));
}

/**
 * 6. EXACTITUD SINTÁCTICA (3.7.1)
 * Evalúa corrección formal (ortografía, typos)
 */
function calcularExactitudSintactica(data: any[]): number {
  if (!data.length) return 10;
  
  const columnas = Object.keys(data[0]);
  let colConErrores = 0;
  
  columnas.forEach(col => {
    const valores = data.map(row => String(row[col] || '')).filter(v => v);
    const valoresUnicos = [...new Set(valores)];
    
    // Detectar valores similares (simplificado: diferencia de 1-2 caracteres)
    let tieneSimilares = false;
    for (let i = 0; i < valoresUnicos.length && !tieneSimilares; i++) {
      for (let j = i + 1; j < valoresUnicos.length; j++) {
        if (sonSimilares(valoresUnicos[i], valoresUnicos[j])) {
          tieneSimilares = true;
          break;
        }
      }
    }
    
    if (tieneSimilares) colConErrores++;
  });
  
  const proporcion = colConErrores / columnas.length;
  return 10 * (1 - Math.pow(proporcion, 2));
}

// Función auxiliar: detectar similitud (Levenshtein simplificado)
function sonSimilares(str1: string, str2: string): boolean {
  if (Math.abs(str1.length - str2.length) > 2) return false;
  
  let diferencias = 0;
  const maxLen = Math.max(str1.length, str2.length);
  
  for (let i = 0; i < maxLen; i++) {
    if (str1[i] !== str2[i]) diferencias++;
    if (diferencias > 2) return false;
  }
  
  return diferencias > 0 && diferencias <= 2;
}

/**
 * 7. EXACTITUD SEMÁNTICA (3.7.2)
 * Mide coherencia entre título/descripción y valores
 */
function calcularExactitudSemantica(data: any[], metadata?: DatasetMetadata): number {
  if (!data.length) return 10;
  
  const columnas = Object.keys(data[0]);
  let colNoSemantica = 0;
  
  columnas.forEach(col => {
    const descripcion = metadata?.columnasDescripciones?.[col] || col;
    const valoresFrecuentes = obtenerValoresFrecuentes(data, col, 5);
    
    // Similitud simplificada: verificar si palabras clave del nombre están en valores
    const palabrasClave = descripcion.toLowerCase().split(/\s+/);
    let coincidencias = 0;
    
    valoresFrecuentes.forEach(valor => {
      const valorStr = String(valor).toLowerCase();
      palabrasClave.forEach(palabra => {
        if (valorStr.includes(palabra)) coincidencias++;
      });
    });
    
    if (coincidencias === 0) colNoSemantica++;
  });
  
  const proporcion = colNoSemantica / columnas.length;
  return 10 - (10 * Math.pow(proporcion, 2));
}

function obtenerValoresFrecuentes(data: any[], col: string, top: number): any[] {
  const conteo = new Map();
  data.forEach(row => {
    const val = row[col];
    if (val != null) {
      conteo.set(val, (conteo.get(val) || 0) + 1);
    }
  });
  
  return Array.from(conteo.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([val]) => val);
}

/**
 * 8. COMPLETITUD (3.8)
 * Mide proporción de valores disponibles (ausencia de nulos)
 */
function calcularCompletitud(data: any[]): number {
  if (!data.length) return 10;
  
  const columnas = Object.keys(data[0]);
  const totalCeldas = data.length * columnas.length;
  let totalNulos = 0;
  let colVacias = 0;
  
  columnas.forEach(col => {
    let nulosCol = 0;
    data.forEach(row => {
      if (row[col] == null || row[col] === '' || row[col] === 'null' || row[col] === 'undefined') {
        totalNulos++;
        nulosCol++;
      }
    });
    
    if (nulosCol === data.length) colVacias++;
  });
  
  // Factor de penalización exponencial = 1.5
  const medidaCompletitudDatos = 10 * (1 - Math.pow(totalNulos / totalCeldas, 1.5));
  const medidaCompletitudCol = 10 * (1 - (colVacias / columnas.length));
  const medidaColNoVacias = 10 * ((columnas.length - colVacias) / columnas.length);
  
  return (medidaCompletitudDatos + medidaCompletitudCol + medidaColNoVacias) / 3;
}

/**
 * 9. CONSISTENCIA (3.9)
 * Datos libres de contradicción
 */
function calcularConsistencia(data: any[], exactitudSintactica: number): number {
  if (!data.length) return 10;
  
  const columnas = Object.keys(data[0]);
  
  // Medida de consistencia de caracteres (textos cortos vs largos)
  let inconsistencias = 0;
  columnas.forEach(col => {
    const longitudes = data.map(row => String(row[col] || '').length);
    const promedio = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
    const varianza = longitudes.reduce((sum, len) => sum + Math.pow(len - promedio, 2), 0) / longitudes.length;
    
    // Penalización con factor 2
    if (varianza > promedio * 2) inconsistencias++;
  });
  
  const medidaConsistenciaCar = 10 * (1 - Math.pow(inconsistencias / columnas.length, 2));
  
  // Columnas duplicadas
  const nombresSet = new Set(columnas);
  const atributoColDuplicadas = nombresSet.size === columnas.length ? 10 : 0;
  
  return (exactitudSintactica + medidaConsistenciaCar + atributoColDuplicadas) / 3;
}

/**
 * 10. PRECISIÓN (3.10)
 * Evalúa nivel de desagregación
 */
function calcularPrecision(data: any[]): number {
  if (!data.length) return 10;
  
  const columnas = Object.keys(data[0]);
  let columnasCumplen = 0;
  
  columnas.forEach(col => {
    const valores = data.map(row => row[col]).filter(v => v != null);
    const valoresUnicos = new Set(valores);
    
    // Criterio 1: Al menos 2 valores únicos
    if (valoresUnicos.size >= 2) {
      // Criterio 2: Varianza mínima para numéricos
      const valoresNum = valores.filter(v => !isNaN(Number(v))).map(Number);
      if (valoresNum.length > 0) {
        const promedio = valoresNum.reduce((a, b) => a + b, 0) / valoresNum.length;
        const varianza = valoresNum.reduce((sum, v) => sum + Math.pow(v - promedio, 2), 0) / valoresNum.length;
        
        if (varianza >= 0.1) columnasCumplen++;
      } else {
        // Para categóricos, solo verificar diversidad
        if (valoresUnicos.size / valores.length > 0.1) columnasCumplen++;
      }
    }
  });
  
  return (columnasCumplen / columnas.length) * 10;
}

/**
 * 11. PORTABILIDAD (3.11)
 * Facilidad de transferencia e interoperabilidad
 */
function calcularPortabilidad(data: any[], completitud: number, conformidad: number): number {
  if (!data.length) return 10;
  
  const columnas = Object.keys(data[0]);
  let colSinCaracteresEspeciales = 0;
  
  const caracteresEspeciales = /[^a-zA-Z0-9_\s\-]/;
  
  columnas.forEach(col => {
    const tieneEspeciales = data.some(row => {
      const valor = String(row[col] || '');
      return caracteresEspeciales.test(valor);
    });
    
    if (!tieneEspeciales) colSinCaracteresEspeciales++;
  });
  
  const portabilidad = (colSinCaracteresEspeciales / columnas.length) * 10;
  
  // Ponderación
  return (portabilidad * 0.5) + (conformidad * 0.25) + (completitud * 0.25);
}

/**
 * 12. CREDIBILIDAD (3.12)
 * Basada en presencia de metadatos de fuente
 */
function calcularCredibilidad(metadata?: DatasetMetadata): number {
  const tieneFuente = metadata?.fuente ? 1 : 0;
  const tienePublicador = metadata?.publicador ? 1 : 0;
  const tieneDescripciones = metadata?.columnasDescripciones ? 1 : 0;
  
  const medidaMetadatosCompletos = ((tieneFuente + tienePublicador) / 2) * 10;
  const medidaPublicadorValido = tienePublicador * 10;
  const medidaColDescValida = tieneDescripciones * 10;
  
  return (medidaMetadatosCompletos * 0.7) + (medidaPublicadorValido * 0.05) + (medidaColDescValida * 0.25);
}

/**
 * 13. COMPRENSIBILIDAD (3.13)
 * Calidad de descripciones y etiquetas
 */
function calcularComprensibilidad(metadata?: DatasetMetadata): number {
  const longitudDesc = metadata?.descripcion?.length || 0;
  const numEtiquetas = metadata?.etiquetas?.length || 0;
  
  // Función exponencial para descripción (max 10 puntos)
  const medidaDescExt = Math.min(10, (1 - Math.exp(-longitudDesc / 100)) * 10);
  
  // Función logarítmica para etiquetas (max 10 puntos)
  const medidaEtiquetaFila = numEtiquetas > 0 ? Math.min(10, Math.log(numEtiquetas + 1) * 3) : 0;
  
  return (medidaDescExt * 0.6) + (medidaEtiquetaFila * 0.4);
}

/**
 * 14. ACCESIBILIDAD (3.14)
 * Presencia de etiquetas y vínculos
 */
function calcularAccesibilidad(metadata?: DatasetMetadata): number {
  const puntajeTags = (metadata?.etiquetas && metadata.etiquetas.length > 0) ? 5 : 0;
  const puntajeLink = metadata?.vinculo ? 5 : 0;
  
  return puntajeTags + puntajeLink;
}

/**
 * 15. UNICIDAD (3.15)
 * Ausencia de duplicados
 */
function calcularUnicidad(data: any[]): number {
  if (!data.length) return 10;
  
  // Filas duplicadas
  const filasStr = data.map(row => JSON.stringify(row));
  const filasUnicas = new Set(filasStr);
  const proporcionFilasDuplicadas = ((data.length - filasUnicas.size) / data.length);
  
  // Columnas duplicadas
  const columnas = Object.keys(data[0]);
  const columnasStr = columnas.map(col => JSON.stringify(data.map(row => row[col])));
  const columnasUnicas = new Set(columnasStr);
  const proporcionColumnasDuplicadas = ((columnas.length - columnasUnicas.size) / columnas.length);
  
  const medidaFilas = 10 * (1 - proporcionFilasDuplicadas);
  const medidaColumnas = 10 * (1 - proporcionColumnasDuplicadas);
  
  return (medidaFilas + medidaColumnas) / 2;
}

/**
 * 16. EFICIENCIA (3.16)
 * Relacionada con completitud y ausencia de duplicados
 */
function calcularEficiencia(completitud: number, unicidad: number): number {
  return (completitud + unicidad) / 2;
}

/**
 * 17. RECUPERABILIDAD (3.17)
 * Facilidad de recuperación basada en metadatos
 */
function calcularRecuperabilidad(accesibilidad: number, metadata?: DatasetMetadata): number {
  const metadatosCompletos = metadata?.fuente && metadata?.publicador ? 10 : 5;
  const metadatosAuditados = metadata?.fechaActualizacion ? 10 : 5;
  
  return (accesibilidad + metadatosCompletos + metadatosAuditados) / 3;
}

/**
 * 18. DISPONIBILIDAD (3.18)
 * Vigencia y accesibilidad
 */
function calcularDisponibilidad(accesibilidad: number, actualidad: number): number {
  return (accesibilidad + actualidad) / 2;
}

/**
 * FUNCIÓN PRINCIPAL: Evaluar calidad del dataset
 */
export async function evaluarCalidadDataset(
  url: string,
  metadata?: DatasetMetadata
): Promise<QualityResults> {
  try {
    // 1. Obtener datos
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('El dataset debe ser un array JSON no vacío');
    }
    
    // 2. Calcular criterios
    const confidencialidad = calcularConfidencialidad(data);
    const relevancia = calcularRelevancia(data, metadata);
    const actualidad = calcularActualidad(metadata);
    const trazabilidad = calcularTrazabilidad(metadata);
    const conformidad = calcularConformidad(data);
    const exactitudSintactica = calcularExactitudSintactica(data);
    const exactitudSemantica = calcularExactitudSemantica(data, metadata);
    const completitud = calcularCompletitud(data);
    const consistencia = calcularConsistencia(data, exactitudSintactica);
    const precision = calcularPrecision(data);
    const unicidad = calcularUnicidad(data);
    const accesibilidad = calcularAccesibilidad(metadata);
    const credibilidad = calcularCredibilidad(metadata);
    const comprensibilidad = calcularComprensibilidad(metadata);
    const portabilidad = calcularPortabilidad(data, completitud, conformidad);
    const eficiencia = calcularEficiencia(completitud, unicidad);
    const recuperabilidad = calcularRecuperabilidad(accesibilidad, metadata);
    const disponibilidad = calcularDisponibilidad(accesibilidad, actualidad);
    
    // 3. Calcular promedio general
    const criterios = [
      confidencialidad, relevancia, actualidad, trazabilidad, conformidad,
      exactitudSintactica, exactitudSemantica, completitud, consistencia,
      precision, portabilidad, credibilidad, comprensibilidad, accesibilidad,
      unicidad, eficiencia, recuperabilidad, disponibilidad
    ];
    
    const promedioGeneral = criterios.reduce((sum, val) => sum + val, 0) / criterios.length;
    
    return {
      confidencialidad,
      relevancia,
      actualidad,
      trazabilidad,
      conformidad,
      exactitudSintactica,
      exactitudSemantica,
      completitud,
      consistencia,
      precision,
      portabilidad,
      credibilidad,
      comprensibilidad,
      accesibilidad,
      unicidad,
      eficiencia,
      recuperabilidad,
      disponibilidad,
      promedioGeneral
    };
  } catch (error) {
    console.error('Error evaluando calidad del dataset:', error);
    throw error;
  }
}
