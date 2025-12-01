# Cambios Realizados en la Sección "Acerca de DataCensus"

## 📝 Resumen

Se han agregado tres nuevas referencias a la sección "Acerca de DataCensus":

### 1. **Main Backend**
- **Descripción**: Sistema principal de la plataforma
- **Link**: https://github.com/TheZombie272/Main-Backend
- **Ubicación**: Sección "Repositorios Fuente"

### 2. **Manual de Usuario**
- **Descripción**: Guía completa de uso de DataCensus
- **Link**: https://docs.google.com/document/d/1MhOERYRkKG2ERk4ISDo3gqmKA-FDS7gKQJUv6HqcSFg/edit?usp=sharing
- **Ubicación**: Sección "Recursos"

### 3. **Documentación Técnica**
- **Descripción**: Referencias de API y arquitectura
- **Link**: https://docs.google.com/document/d/1qEvWo74gP4cOPWK4S6M54QXVtrkc_UbAqIbCLUo3VI4/edit?usp=sharing
- **Ubicación**: Sección "Recursos"

## 🔧 Cambios Técnicos

### Archivos Modificados:

#### 1. **`src/config/environment.ts`**
Se agregaron dos nuevas constantes de configuración:
```typescript
export const GITHUB_MAIN_BACKEND_REPO = import.meta.env.VITE_GITHUB_MAIN_BACKEND_REPO || "https://github.com/TheZombie272/Main-Backend";
export const USER_MANUAL_LINK = import.meta.env.VITE_USER_MANUAL_LINK || "https://docs.google.com/document/d/1MhOERYRkKG2ERk4ISDo3gqmKA-FDS7gKQJUv6HqcSFg/edit?usp=sharing";
export const TECHNICAL_DOCUMENTATION_LINK = import.meta.env.VITE_TECHNICAL_DOCUMENTATION_LINK || "https://docs.google.com/document/d/1qEvWo74gP4cOPWK4S6M54QXVtrkc_UbAqIbCLUo3VI4/edit?usp=sharing";
```

#### 2. **`.env`**
Se agregaron las siguientes variables:
```env
VITE_GITHUB_MAIN_BACKEND_REPO=https://github.com/TheZombie272/Main-Backend
VITE_USER_MANUAL_LINK=https://docs.google.com/document/d/1MhOERYRkKG2ERk4ISDo3gqmKA-FDS7gKQJUv6HqcSFg/edit?usp=sharing
VITE_TECHNICAL_DOCUMENTATION_LINK=https://docs.google.com/document/d/1qEvWo74gP4cOPWK4S6M54QXVtrkc_UbAqIbCLUo3VI4/edit?usp=sharing
```

#### 3. **`.env.example`**
Se agregaron las mismas variables con comentarios explicativos.

#### 4. **`src/pages/sections/AboutSection.tsx`**
Se realizaron los siguientes cambios:
- Se importaron las nuevas constantes del ambiente
- Se agregó una nueva tarjeta para "Main Backend" en la sección de Repositorios
- Se actualizaron los links del Manual de Usuario y Documentación Técnica para que apunten a las URLs reales de Google Docs

## ✅ Beneficios

1. **Centralización de URLs**: Todos los links están en `environment.ts` y pueden ser modificados desde `.env`
2. **Flexibilidad**: Los links pueden ser cambiados sin modificar código fuente
3. **Consistencia**: Todas las referencias siguen el mismo patrón
4. **Documentación**: Ambos documentos (Manual y Documentación Técnica) ahora son accesibles directamente desde la sección "Acerca de"

## 🧪 Validación

- ✅ Compilación exitosa sin errores
- ✅ Build de producción completado
- ✅ Todos los links están funcionales
- ✅ Variables de entorno implementadas correctamente
