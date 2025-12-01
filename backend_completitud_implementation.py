"""
Métrica de Completitud - Implementación Python para Backend FastAPI

Este módulo implementa el cálculo de la métrica de Completitud según la 
Guía de Calidad e Interoperabilidad 2025 del MinTIC.

Autor: DataCensus Development Team
Versión: 1.0
Fecha: 2025-11-26
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware


# ============================================================================
# MODELOS PYDANTIC
# ============================================================================

class CompletenessDetails(BaseModel):
    """Detalles técnicos del cálculo de completitud"""
    medida_completitud_datos: float = Field(..., ge=0, le=10)
    medida_completitud_col: float = Field(..., ge=0, le=10)
    medida_col_no_vacias: float = Field(..., ge=0, le=10)
    total_celdas: int
    total_nulos: int
    porcentaje_celdas_nulas: float = Field(..., ge=0, le=100)
    columnas_esperadas: int
    columnas_reales: int
    columnas_con_alto_porcentaje_nulos: int
    total_filas: int


class CompletenessResponse(BaseModel):
    """Response de la métrica de completitud"""
    dataset_id: str
    metric: str = "completitud"
    score: float = Field(..., ge=0, le=10)
    max_score: int = 10
    percentage: float = Field(..., ge=0, le=100)
    details: CompletenessDetails


# ============================================================================
# FUNCIONES DE CÁLCULO
# ============================================================================

def calculate_data_completeness(
    total_nulos: int,
    total_celdas: int
) -> float:
    """
    Calcula medidaCompletitudDatos.
    
    Fórmula:
    medidaCompletitudDatos = 10 × (1 - (totalNulos / totalCeldas)^1.5)
    
    Parámetros:
    -----------
    total_nulos : int
        Número total de celdas nulas o vacías
    total_celdas : int
        Número total de celdas (filas × columnas)
    
    Retorna:
    --------
    float
        Puntuación de completitud de datos (0-10)
    
    Ejemplos:
    ---------
    >>> calculate_data_completeness(100, 10000)
    9.699...
    
    >>> calculate_data_completeness(5000, 10000)
    3.535...
    """
    if total_celdas == 0:
        return 10.0
    
    ratio_nulos = total_nulos / total_celdas
    medida = 10 * (1 - (ratio_nulos ** 1.5))
    
    # Asegurar rango [0, 10]
    return max(0.0, min(10.0, medida))


def calculate_column_completeness(
    columnas_sparse: int,
    total_columnas: int
) -> float:
    """
    Calcula medidaCompletitudCol.
    
    Fórmula:
    medidaCompletitudCol = 10 × (1 - (numColPorcNulos / totalColumnas)^2)
    
    Parámetros:
    -----------
    columnas_sparse : int
        Número de columnas con >50% de valores nulos
    total_columnas : int
        Número total de columnas
    
    Retorna:
    --------
    float
        Puntuación de completitud de columnas (0-10)
    
    Ejemplos:
    ---------
    >>> calculate_column_completeness(0, 10)
    10.0
    
    >>> calculate_column_completeness(5, 10)
    7.5
    """
    if total_columnas == 0:
        return 10.0
    
    ratio_columnas_sparse = columnas_sparse / total_columnas
    medida = 10 * (1 - (ratio_columnas_sparse ** 2))
    
    # Asegurar rango [0, 10]
    return max(0.0, min(10.0, medida))


def calculate_column_coverage(
    total_columnas_metadata: int,
    total_columnas_reales: int
) -> float:
    """
    Calcula medidaColNoVacias.
    
    Fórmula:
    medidaColNoVacias = 10 × (totalColumnasMetadata / totalColumnas)
    
    Parámetros:
    -----------
    total_columnas_metadata : int
        Columnas indicadas en los metadatos
    total_columnas_reales : int
        Columnas realmente cargadas en el dataset
    
    Retorna:
    --------
    float
        Puntuación de cobertura de columnas (0-10)
    
    Ejemplos:
    ---------
    >>> calculate_column_coverage(12, 12)
    10.0
    
    >>> calculate_column_coverage(10, 12)
    8.333...
    """
    if total_columnas_reales == 0:
        return 0.0
    
    medida = 10 * (total_columnas_metadata / total_columnas_reales)
    
    # Asegurar rango [0, 10]
    return max(0.0, min(10.0, medida))


def count_sparse_columns(
    dataset: pd.DataFrame,
    threshold: float = 0.5
) -> int:
    """
    Cuenta el número de columnas con más del 50% de valores nulos/vacíos.
    
    Parámetros:
    -----------
    dataset : pd.DataFrame
        El dataset a analizar
    threshold : float
        Umbral de porcentaje (por defecto 0.5 = 50%)
    
    Retorna:
    --------
    int
        Número de columnas sparse (con >threshold de nulos)
    
    Notas:
    ------
    - Se cuentan valores None, NaN, NaT
    - Se cuentan strings vacíos ""
    - Se cuentan strings con solo espacios " "
    
    Ejemplos:
    ---------
    >>> df = pd.DataFrame({
    ...     'A': [1, 2, None, None, None],
    ...     'B': [1, 2, 3, 4, 5]
    ... })
    >>> count_sparse_columns(df)
    1
    """
    sparse_count = 0
    
    for column in dataset.columns:
        # Contar nulos
        nulos = dataset[column].isnull().sum()
        
        # Contar strings vacíos o solo espacios
        if dataset[column].dtype == 'object':
            nulos += (dataset[column] == '').sum()
            nulos += (dataset[column].str.strip() == '').sum()
        
        # Calcular porcentaje
        porcentaje_nulos = nulos / len(dataset) if len(dataset) > 0 else 0
        
        # Contar si supera umbral
        if porcentaje_nulos >= threshold:
            sparse_count += 1
    
    return sparse_count


def get_column_null_stats(dataset: pd.DataFrame) -> Dict[str, Dict[str, Any]]:
    """
    Obtiene estadísticas de nulos por columna.
    
    Retorna:
    --------
    Dict con información de cada columna:
    {
        "nombre_columna": {
            "total_nulos": int,
            "porcentaje_nulos": float,
            "es_sparse": bool
        }
    }
    """
    stats = {}
    
    for column in dataset.columns:
        nulos = dataset[column].isnull().sum()
        
        if dataset[column].dtype == 'object':
            nulos += (dataset[column] == '').sum()
        
        porcentaje = (nulos / len(dataset) * 100) if len(dataset) > 0 else 0
        
        stats[str(column)] = {
            "total_nulos": int(nulos),
            "porcentaje_nulos": round(porcentaje, 2),
            "es_sparse": porcentaje >= 50.0
        }
    
    return stats


# ============================================================================
# FUNCIÓN PRINCIPAL
# ============================================================================

def calculate_completeness_metric(
    dataset: pd.DataFrame,
    metadata: Dict[str, Any],
    dataset_id: str,
    threshold_sparse: float = 0.5
) -> CompletenessResponse:
    """
    Calcula la métrica de Completitud para un dataset.
    
    Esta función implementa la fórmula definida en la Guía de Calidad 
    e Interoperabilidad 2025 del MinTIC.
    
    Parámetros:
    -----------
    dataset : pd.DataFrame
        Dataset cargado con los registros
    metadata : Dict[str, Any]
        Metadatos del dataset. Debe contener:
        - 'total_columnas': int (opcional, si no está se usa len(columns))
        - Otros campos de metadatos
    dataset_id : str
        ID único del dataset
    threshold_sparse : float
        Umbral para considerar una columna como "sparse" (default: 0.5 = 50%)
    
    Retorna:
    --------
    CompletenessResponse
        Objeto con la métrica calculada y detalles
    
    Raises:
    -------
    ValueError
        Si dataset está vacío o tiene estructura inválida
    
    Ejemplos:
    ---------
    >>> import pandas as pd
    >>> df = pd.DataFrame({
    ...     'id': [1, 2, 3, 4, 5],
    ...     'nombre': ['A', 'B', 'C', None, 'E'],
    ...     'valor': [10, 20, None, None, 50]
    ... })
    >>> metadata = {'total_columnas': 3}
    >>> resultado = calculate_completeness_metric(df, metadata, 'test-001')
    >>> print(f"Score: {resultado.score}/10")
    """
    
    # Validar entrada
    if dataset is None or dataset.empty:
        raise ValueError("Dataset no puede estar vacío")
    
    # Información de metadatos
    total_columnas_esperadas = metadata.get('total_columnas', len(dataset.columns))
    
    # Información del dataset
    total_columnas_reales = len(dataset.columns)
    total_filas = len(dataset)
    total_celdas = total_filas * total_columnas_reales
    
    # Contar nulos
    total_nulos = dataset.isnull().sum().sum()
    
    # Contar strings vacíos o solo espacios
    for col in dataset.columns:
        if dataset[col].dtype == 'object':
            total_nulos += (dataset[col] == '').sum()
            total_nulos += (dataset[col].str.strip() == '').sum()
    
    # Columnas con alto porcentaje de nulos
    columnas_sparse = count_sparse_columns(dataset, threshold_sparse)
    
    # Calcular las tres medidas
    medida_completitud_datos = calculate_data_completeness(total_nulos, total_celdas)
    medida_completitud_col = calculate_column_completeness(
        columnas_sparse,
        total_columnas_reales
    )
    medida_col_no_vacias = calculate_column_coverage(
        total_columnas_esperadas,
        total_columnas_reales
    )
    
    # Score final
    completitud_score = (
        medida_completitud_datos +
        medida_completitud_col +
        medida_col_no_vacias
    ) / 3
    
    percentage = (completitud_score / 10) * 100
    
    # Construir respuesta
    return CompletenessResponse(
        dataset_id=dataset_id,
        metric="completitud",
        score=round(completitud_score, 2),
        max_score=10,
        percentage=round(percentage, 2),
        details=CompletenessDetails(
            medida_completitud_datos=round(medida_completitud_datos, 2),
            medida_completitud_col=round(medida_completitud_col, 2),
            medida_col_no_vacias=round(medida_col_no_vacias, 2),
            total_celdas=total_celdas,
            total_nulos=int(total_nulos),
            porcentaje_celdas_nulas=round(
                (total_nulos / total_celdas * 100) if total_celdas > 0 else 0,
                2
            ),
            columnas_esperadas=total_columnas_esperadas,
            columnas_reales=total_columnas_reales,
            columnas_con_alto_porcentaje_nulos=columnas_sparse,
            total_filas=total_filas
        )
    )


# ============================================================================
# ENDPOINT FASTAPI
# ============================================================================

def create_completeness_route(app_instance, get_dataset_func, get_metadata_func):
    """
    Factory para crear el endpoint de completitud.
    
    Uso:
    ----
    from fastapi import FastAPI
    
    app = FastAPI()
    
    # Definir funciones para obtener dataset y metadata
    def get_dataset(dataset_id: str):
        # Tu lógica aquí
        return df
    
    def get_metadata(dataset_id: str):
        # Tu lógica aquí
        return metadata_dict
    
    # Crear endpoint
    create_completeness_route(app, get_dataset, get_metadata)
    """


def enable_cors(app_instance, allow_origins: Optional[list] = None, allow_credentials: bool = True):
    """
    Helper para habilitar CORS en una instancia de FastAPI.

    Parámetros:
    - app_instance: instancia de `FastAPI` donde se añade el middleware
    - allow_origins: lista de orígenes permitidos. Si es `None`, se
      sugiere usar `["https://datacensus.site"]` (URL exacta, con https
      y sin slash final).
    - allow_credentials: si se permiten cookies/Authorization headers

    Nota importante: si usas cookies o `Authorization` no pongas `"*"`
    en `allow_origins`.
    """

    if allow_origins is None:
        allow_origins = ["https://datacensus.site"]

    app_instance.add_middleware(
        CORSMiddleware,
        allow_origins=allow_origins,
        allow_credentials=allow_credentials,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    @app_instance.get("/completitud")
    async def get_completeness(dataset_id: str = None) -> CompletenessResponse:
        """
        Endpoint para calcular la métrica de Completitud.
        
        Query Parameters:
        -----------------
        dataset_id : str
            ID del dataset a analizar
        
        Returns:
        --------
        CompletenessResponse
            Métrica de completitud con detalles de cálculo
        """
        from fastapi import HTTPException
        
        try:
            if dataset_id is None:
                raise HTTPException(
                    status_code=400,
                    detail="dataset_id es requerido"
                )
            
            # Obtener dataset
            dataset = get_dataset_func(dataset_id)
            if dataset is None:
                raise HTTPException(
                    status_code=404,
                    detail=f"Dataset con ID '{dataset_id}' no encontrado"
                )
            
            # Obtener metadata
            metadata = get_metadata_func(dataset_id)
            if metadata is None:
                metadata = {}
            
            # Convertir a DataFrame si es necesario
            if not isinstance(dataset, pd.DataFrame):
                dataset = pd.DataFrame(dataset)
            
            # Calcular métrica
            resultado = calculate_completeness_metric(
                dataset=dataset,
                metadata=metadata,
                dataset_id=dataset_id
            )
            
            return resultado
        
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error al calcular completitud: {str(e)}"
            )


# ============================================================================
# EJEMPLO DE USO
# ============================================================================

if __name__ == "__main__":
    # Crear dataset de ejemplo
    import pandas as pd
    
    np.random.seed(42)
    df = pd.DataFrame({
        'id': range(1, 101),
        'nombre': ['Person_' + str(i) if i % 10 != 0 else None for i in range(1, 101)],
        'email': ['email_' + str(i) + '@example.com' for i in range(1, 101)],
        'edad': [np.random.randint(18, 80) if np.random.random() > 0.3 else None for _ in range(100)],
        'ciudad': [np.random.choice(['NYC', 'LA', 'CHI', '']) for _ in range(100)]
    })
    
    metadata = {
        'total_columnas': 5,
        'dataset_name': 'Personas',
        'description': 'Dataset de personas de ejemplo'
    }
    
    # Calcular
    resultado = calculate_completeness_metric(df, metadata, 'personas-001')
    
    # Mostrar resultados
    print(f"\n{'='*60}")
    print(f"MÉTRICA DE COMPLETITUD")
    print(f"{'='*60}")
    print(f"Dataset ID: {resultado.dataset_id}")
    print(f"Score: {resultado.score}/10 ({resultado.percentage}%)")
    print(f"\nDetalles:")
    print(f"  Completitud de Datos: {resultado.details.medida_completitud_datos}/10")
    print(f"  Completitud de Columnas: {resultado.details.medida_completitud_col}/10")
    print(f"  Cobertura de Columnas: {resultado.details.medida_col_no_vacias}/10")
    print(f"\nEstadísticas:")
    print(f"  Total de filas: {resultado.details.total_filas}")
    print(f"  Total de columnas: {resultado.details.columnas_reales}")
    print(f"  Columnas esperadas: {resultado.details.columnas_esperadas}")
    print(f"  Total de celdas: {resultado.details.total_celdas}")
    print(f"  Total de nulos: {resultado.details.total_nulos}")
    print(f"  Porcentaje de nulos: {resultado.details.porcentaje_celdas_nulas}%")
    print(f"  Columnas sparse (>50% nulos): {resultado.details.columnas_con_alto_porcentaje_nulos}")
    print(f"{'='*60}\n")

    # ------------------------------------------------------------------
    # Ejemplo de cómo exponer este módulo como servidor FastAPI
    # (descomentar y adaptar `get_dataset` / `get_metadata` antes de usar)
    # ------------------------------------------------------------------
    # from fastapi import FastAPI
    # import uvicorn
    #
    # app = FastAPI()
    #
    # # Añadir CORS: reemplazar por la URL exacta del frontend
    # enable_cors(app, allow_origins=["https://datacensus.site"])  # <-- URL EXACTA
    #
    # # Proveer funciones que retornen el dataset y metadata por ID
    # def get_dataset(dataset_id: str):
    #     # lógica para obtener dataframe
    #     return df
    #
    # def get_metadata(dataset_id: str):
    #     return metadata
    #
    # create_completeness_route(app, get_dataset, get_metadata)
    #
    # # Ejecutar con:
    # # uvicorn backend_completitud_implementation:app --host 0.0.0.0 --port 8001
