# 🎨 GUÍA DE ESTILOS MODERNA Y PROFESIONAL - DataCensus

## Sistema de Colores Primario
```
Azul Primario: #2962FF
Azul Oscuro: #1E4ED8
Gris Claro: #F3F4F6
Gris Neutral: #6B7280
Blanco: #FFFFFF
```

---

## 1. HEADER

### Estilos Principales
```tsx
// Contenedor
bg-white/80 backdrop-blur-md
// Sin bordes, sin sombras fuertes

// Logo
<div className="bg-gradient-to-br from-[#2962FF] to-[#1E4ED8] rounded-lg p-2.5">
  <Database className="w-6 h-6 text-white" />
</div>

// Título
<h1 className="text-xl font-bold text-[#2962FF]">DataCensus</h1>

// Botón Activo
className="bg-[#2962FF] text-white shadow-lg shadow-blue-500/10 rounded-lg"

// Botón Inactivo
className="text-gray-700 hover:bg-gray-100/80 rounded-lg"
```

### Input Dataset ID
```tsx
<Input
  placeholder="Ej: 8dbv-wsjq"
  className="h-10 bg-gray-50/50 border-0 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:bg-white"
/>
```

---

## 2. INPUTS PRINCIPALES

### Estilos Base
```tsx
className="border-0 bg-gray-50/50 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-colors"
```

**Detalles:**
- Sin bordes (`border-0`)
- Fondo gris translúcido (`bg-gray-50/50`)
- Focus: Ring azul sutil (`ring-2 ring-blue-500/20`)
- Cambio suave de color (`transition-colors`)

---

## 3. BOTONES PRIMARIOS

### Estilos Base
```tsx
className="bg-gradient-to-r from-[#2962FF] to-[#1E4ED8] hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
```

**Detalles:**
- Gradiente: azul a azul oscuro
- Hover: Escalado 105% (`hover:scale-105`)
- Hover shadow: `hover:shadow-lg hover:shadow-blue-500/20`
- Sin bordes
- Disabled: Opacidad 50%, cursor not-allowed

---

## 4. TARJETAS DE MÉTRICAS

### Estilos Base
```tsx
className="p-6 border-0 shadow-lg shadow-blue-500/5 bg-white rounded-lg"
```

**Con Hover (Opcional)**
```tsx
className="p-6 border-0 shadow-lg shadow-blue-500/5 hover:shadow-lg hover:shadow-blue-500/10 transition-shadow bg-white rounded-lg"
```

**Detalles:**
- Sin bordes (`border-0`)
- Sombra muy sutil (`shadow-lg shadow-blue-500/5`)
- Fondo blanco puro
- Hover aumenta sombra (`shadow-blue-500/10`)

---

## 5. ANIMACIONES LOADING

### Pulsante Sutil
```tsx
<div className="relative w-12 h-12">
  <div className="absolute inset-0 bg-gradient-to-r from-[#2962FF] to-[#1E4ED8] rounded-full animate-pulse" />
  <div className="absolute inset-2 bg-white rounded-full" />
</div>
```

**Alternativa con Spinner**
```tsx
<Loader2 className="w-16 h-16 text-[#2962FF] animate-spin" />
```

---

## 6. FOOTER

### Estilos Base
```tsx
className="bg-white/50 border-0 mt-16 py-6"
```

**Texto**
```tsx
className="text-center text-xs text-gray-600"
```

**Detalles:**
- Fondo blanco translúcido
- Sin bordes
- Texto gris neutral

---

## 7. SECCIONES Y FONDOS

### Fondo Principal
```tsx
className="min-h-screen bg-gray-50"
```

### Fondo Página Completa
```tsx
className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100"
```

---

## 8. ALERTAS

### Alert Destructivo
```tsx
className="border-0 bg-red-50 border-l-4 border-l-red-500"
```

### Alert Info
```tsx
className="bg-blue-50 border-l-4 border-l-[#2962FF]"
```

---

## 9. TARJETAS INFORMATIVAS

### Card Estándar
```tsx
<Card className="p-6 border-0 shadow-lg shadow-blue-500/5 bg-white">
  {/* contenido */}
</Card>
```

### Card sin Contenido (Placeholder)
```tsx
<Card className="p-4 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg">
  {/* contenido */}
</Card>
```

---

## 10. BADGES Y ETIQUETAS

### Badge Activo
```tsx
className="px-3 py-1 bg-[#2962FF] text-white rounded-full text-xs font-medium"
```

### Badge Inactivo
```tsx
className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
```

---

## EJEMPLOS COMPLETOS

### Página Métrica
```tsx
<div className="min-h-screen bg-gray-50">
  {/* Header */}
  <header className="bg-white/80 backdrop-blur-md sticky top-0">
    {/* contenido */}
  </header>

  {/* Main */}
  <main className="container mx-auto px-4 py-8 space-y-8">
    {/* Card Principal */}
    <Card className="p-6 border-0 shadow-lg shadow-blue-500/5 bg-white">
      <button className="w-full bg-gradient-to-r from-[#2962FF] to-[#1E4ED8] hover:scale-105 text-white py-3 rounded-lg font-semibold">
        Analizar Dataset
      </button>
    </Card>

    {/* Metrics Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4 border-0 shadow-lg shadow-blue-500/5 bg-white">
        {/* métrica */}
      </Card>
    </div>
  </main>

  {/* Footer */}
  <footer className="bg-white/50 border-0 py-6 mt-16">
    <p className="text-center text-xs text-gray-600">© 2025</p>
  </footer>
</div>
```

### Search Agent
```tsx
<div className="min-h-screen bg-gray-50">
  <Card className="p-6 border-0 shadow-lg shadow-blue-500/5 bg-white">
    <div className="flex gap-3">
      <Input
        placeholder="Buscar..."
        className="border-0 bg-gray-50/50 focus:ring-2 focus:ring-blue-500/20"
      />
      <button className="bg-gradient-to-r from-[#2962FF] to-[#1E4ED8] hover:scale-105 text-white px-6 rounded-lg">
        Buscar
      </button>
    </div>
  </Card>
</div>
```

---

## NOTAS IMPORTANTES

✅ **Hacer:**
- Usar el azul #2962FF como color primario
- Mantener bordes mínimos o ninguno
- Usar sombras sutiles azules (`shadow-blue-500/5`)
- Espacios generosos en padding
- Transiciones suaves (200-300ms)
- Focus rings sutiles en inputs

❌ **Evitar:**
- Bordes marcados o grises oscuros
- Fondos demasiado coloridos
- Sombras negras fuertes
- Efectos de hover agresivos
- Muchos elementos visuales a la vez

---

## RESPONSIVIDAD

```tsx
// Mobile First
<div className="flex flex-col gap-3">
  {/* Elementos */}
</div>

// Tablet+
<div className="hidden sm:flex flex-row gap-4">
  {/* Elementos */}
</div>

// Desktop
<div className="hidden md:flex lg:grid-cols-4">
  {/* Elementos */}
</div>
```

---

**Versión:** 1.0  
**Fecha:** 26 Nov 2025  
**Proyecto:** DataCensus - MinTIC
