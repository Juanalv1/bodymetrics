# Body Fat Calculator — Plan de Desarrollo para Claude Code

## Contexto del Proyecto

Construir una aplicación web llamada **BodyMetrics** que permita a los usuarios calcular su porcentaje de grasa corporal. El desarrollo se divide en dos fases claramente separadas para facilitar iteración y entrega incremental.

---

## Stack Técnico

- **Framework**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes**: shadcn/ui
- **Gráficas**: Recharts
- **IA (Fase 2)**: Anthropic SDK (`@anthropic-ai/sdk`) — claude-sonnet-4-20250514 con visión

---

## Estructura de Archivos

```
bodymetrics/
├── app/
│   ├── page.tsx                        # Landing / hero
│   ├── calculator/
│   │   └── page.tsx                    # Calculadora (Fase 1)
│   ├── ai-analysis/
│   │   └── page.tsx                    # Análisis por imagen (Fase 2)
│   └── api/
│       └── analyze-body/
│           └── route.ts                # API Route para llamada a Anthropic
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── calculator/
│   │   ├── MethodSelector.tsx          # Tabs para seleccionar método
│   │   ├── MeasurementsForm.tsx        # Formulario dinámico por método
│   │   ├── ResultsPanel.tsx            # Panel de resultados
│   │   └── BodyFatGauge.tsx            # Gráfico tipo gauge/arco
│   └── ai-analysis/
│       ├── ImageUploader.tsx           # Drag & drop de imagen
│       ├── AnalysisProgress.tsx        # Estado de carga streaming
│       └── AIResultCard.tsx            # Resultado del análisis de IA
├── lib/
│   ├── formulas/
│   │   ├── navy.ts                     # Método U.S. Navy
│   │   ├── bmi.ts                      # Método basado en IMC
│   │   └── index.ts                    # Re-exportaciones
│   └── types.ts                        # Tipos compartidos
└── public/
    └── body-diagram.svg                # Diagrama corporal referencial
```

---

## Fase 1 — Calculadora por Medidas

### 1.1 Métodos de Cálculo a Implementar

#### Método U.S. Navy (principal, recomendado)
Requiere: altura, cintura, cuello. Para mujeres también: cadera.

```typescript
// Hombres
BF% = 86.010 * log10(abdomen - neck) - 70.041 * log10(height) + 36.76

// Mujeres
BF% = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
```

#### Método IMC (secundario, más simple)
Requiere: peso, altura, edad, sexo.

```typescript
// Hombres
BF% = (1.20 * BMI) + (0.23 * age) - 16.2

// Mujeres
BF% = (1.20 * BMI) + (0.23 * age) - 5.4
```

### 1.2 Categorías de Grasa Corporal

```typescript
// Rangos American Council on Exercise (ACE)
type BodyFatCategory = {
  label: string
  color: string
  range: { male: [number, number]; female: [number, number] }
}

const CATEGORIES: BodyFatCategory[] = [
  { label: "Atleta",       color: "#3B82F6", range: { male: [6,13],   female: [14,20] } },
  { label: "En forma",     color: "#22C55E", range: { male: [14,17],  female: [21,24] } },
  { label: "Aceptable",    color: "#EAB308", range: { male: [18,24],  female: [25,31] } },
  { label: "Obesidad",     color: "#EF4444", range: { male: [25,100], female: [32,100] } },
]
```

### 1.3 UI de la Calculadora

**Layout en dos columnas (desktop), una columna (mobile):**

- **Columna izquierda**: Formulario de inputs
  - Toggle de unidades: Métrico (cm/kg) ↔ Imperial (in/lb)
  - Selector de sexo (Masculino / Femenino)
  - Selector de método (tabs: Navy / IMC)
  - Campos de medida con etiquetas claras e íconos
  - Botón "Calcular"

- **Columna derecha**: Panel de resultados (aparece tras calcular)
  - **BodyFatGauge**: semicírculo/arco con aguja que apunta al porcentaje
  - Porcentaje grande y prominente
  - Badge de categoría con color (Atleta / En forma / Aceptable / Obesidad)
  - Tabla de referencia con rangos por categoría y sexo
  - Botón de CTA: "¿Quieres un análisis visual con IA? →" (link a Fase 2)

### 1.4 Tipos TypeScript

```typescript
// lib/types.ts
export type Sex = "male" | "female"
export type UnitSystem = "metric" | "imperial"
export type CalculationMethod = "navy" | "bmi"

export interface NavyInputs {
  sex: Sex
  height: number      // cm
  waist: number       // cm
  neck: number        // cm
  hip?: number        // cm — solo mujeres
}

export interface BMIInputs {
  sex: Sex
  height: number      // cm
  weight: number      // kg
  age: number
}

export interface BodyFatResult {
  percentage: number
  category: string
  categoryColor: string
  method: CalculationMethod
  bmi?: number
}
```

### 1.5 Validaciones

- Todos los campos requeridos antes de calcular
- Rangos razonables: altura 100–250cm, cintura 40–200cm, cuello 20–80cm
- Mostrar errores inline bajo cada campo
- Si el resultado es < 3% o > 70%, mostrar advertencia de revisión de medidas

---

## Fase 2 — Análisis de Imagen con IA

> **Nota de privacidad**: La imagen NO se almacena en ningún servidor. Se procesa en memoria y se descarta. Mostrar este aviso claramente en la UI.

### 2.1 Flujo de Usuario

```
1. Usuario sube o arrastra una foto (cuerpo completo, ropa ajustada)
2. Preview de imagen en el cliente
3. Click "Analizar con IA"
4. Imagen se convierte a base64 en el cliente
5. POST a /api/analyze-body con { image: base64, mimeType, previousResults? }
6. API Route llama a Anthropic con claude-sonnet-4-20250514 + visión
7. Response en streaming se muestra progresivamente
8. Resultado final con estimación y recomendaciones
```

### 2.2 API Route — `/api/analyze-body/route.ts`

```typescript
import Anthropic from "@anthropic-ai/sdk"
import { NextRequest } from "next/server"

const client = new Anthropic()

export async function POST(req: NextRequest) {
  const { image, mimeType, previousResults } = await req.json()

  const systemPrompt = `Eres un experto en composición corporal y fitness. 
Analiza la imagen corporal proporcionada y estima el porcentaje de grasa corporal 
basándote en indicadores visuales como distribución de grasa, definición muscular 
y contorno corporal.

IMPORTANTE:
- Sé claro que es una ESTIMACIÓN visual, no un resultado médico
- Da un rango (ej: "entre 18% y 22%") en vez de un número exacto
- Incluye recomendaciones prácticas
- Si la imagen no es adecuada para el análisis, indícalo con respeto
- Responde siempre en español
- Estructura tu respuesta con: Estimación, Observaciones, Recomendaciones`

  const userContent: Anthropic.MessageParam["content"] = [
    {
      type: "image",
      source: {
        type: "base64",
        media_type: mimeType,
        data: image,
      },
    },
    {
      type: "text",
      text: previousResults
        ? `Analiza esta imagen. El usuario ya calculó por medidas: ${JSON.stringify(previousResults)}. Complementa con el análisis visual.`
        : "Analiza esta imagen y estima el porcentaje de grasa corporal.",
    },
  ]

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  })

  return new Response(stream.toReadableStream(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
```

### 2.3 Componente ImageUploader

```typescript
// Especificaciones del componente
- Acepta: image/jpeg, image/png, image/webp
- Tamaño máximo: 5MB
- Drag & drop + click para seleccionar
- Preview inmediato de la imagen seleccionada
- Botón para cambiar imagen
- Indicaciones de buena foto: "Ropa ajustada, iluminación uniforme, vista frontal"
```

### 2.4 Visualización del Resultado de IA

El resultado de streaming se muestra en un card con:
- Animación de escritura (typewriter effect con el stream)
- Sección de **Estimación** resaltada (porcentaje/rango)
- Sección de **Observaciones** 
- Sección de **Recomendaciones** con íconos
- Si el usuario ya tiene resultados de Fase 1, mostrar comparativa lado a lado

---

## Diseño Visual — Directrices

**Estética**: Médico-deportiva moderna. Limpia, confiable, motivadora.

- **Colores primarios**: Negro profundo `#0A0A0A`, Blanco `#FAFAFA`
- **Acento**: Verde lima eléctrico `#AAFF00` para CTAs y métricas clave
- **Fuentes**: Display → `DM Serif Display` | Body → `DM Sans`
- **Gauge/arco**: Gradiente de azul → verde → amarillo → rojo
- **Cards**: Fondo ligeramente elevado con borde sutil, sin sombras exageradas
- **Modo**: Dark mode por defecto, con toggle opcional

---

## Variables de Entorno Necesarias

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

---

## Comandos de Instalación

```bash
npx create-next-app@latest bodymetrics --typescript --tailwind --app
cd bodymetrics
npx shadcn@latest init
npx shadcn@latest add button card tabs input label badge alert
npm install @anthropic-ai/sdk recharts
npm install @fontsource/dm-sans @fontsource/dm-serif-display
```

---

## Checklist de Entrega — Fase 1

- [ ] Proyecto Next.js inicializado con TypeScript y Tailwind
- [ ] Fórmulas implementadas en `lib/formulas/` con tests unitarios simples
- [ ] Formulario con validación completa y toggle métrico/imperial
- [ ] Panel de resultados con BodyFatGauge funcional
- [ ] Tabla de categorías de referencia
- [ ] Responsive en mobile, tablet y desktop
- [ ] Manejo de errores y estados vacíos

## Checklist de Entrega — Fase 2

- [ ] API Route `/api/analyze-body` con streaming funcionando
- [ ] Componente ImageUploader con drag & drop
- [ ] Visualización de streaming con typewriter effect
- [ ] Aviso de privacidad visible
- [ ] Integración opcional con resultados de Fase 1
- [ ] Manejo de errores de API (imagen inapropiada, fallo de red, etc.)

---

## Notas para el Desarrollador

1. **Empezar por Fase 1 completa** antes de tocar cualquier código de IA
2. Las fórmulas deben estar en archivos separados, **puras y testeables** — sin lógica de UI
3. El `ANTHROPIC_API_KEY` solo vive en el servidor (API Route), **nunca en el cliente**
4. El componente `BodyFatGauge` puede construirse con SVG puro o con Recharts `RadialBarChart`
5. Para el streaming en el cliente, usar `ReadableStream` con `TextDecoder` en un `useEffect`
6. Limitar el tamaño de imagen a 5MB antes de enviar al API para controlar costos
