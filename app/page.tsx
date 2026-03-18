import type { Metadata } from "next"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import CalculatorShell from "@/components/calculator/CalculatorShell"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://bodymetrics-lake.vercel.app"

export const metadata: Metadata = {
  title: "Calculadora de Grasa Corporal Gratis | BodyMetrics",
  description:
    "Calcula tu porcentaje de grasa corporal con el método U.S. Navy. Ingresa tu altura, cintura y cuello y obtén tu resultado al instante. Gratis, sin registro.",
  keywords: [
    "calculadora grasa corporal",
    "porcentaje grasa corporal",
    "calcular grasa corporal",
    "método navy grasa corporal",
    "composición corporal",
    "body fat calculator",
    "grasa corporal hombre",
    "grasa corporal mujer",
    "calculadora body fat",
    "medidas corporales",
  ],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Calculadora de Grasa Corporal Gratis | BodyMetrics",
    description:
      "Calcula tu porcentaje de grasa corporal con el método U.S. Navy. Resultado instantáneo, gratis y sin registro.",
    url: BASE_URL,
    siteName: "BodyMetrics",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculadora de Grasa Corporal Gratis | BodyMetrics",
    description:
      "Calcula tu porcentaje de grasa corporal con el método U.S. Navy. Resultado instantáneo, gratis y sin registro.",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/#app`,
      name: "BodyMetrics — Calculadora de Grasa Corporal",
      url: BASE_URL,
      description:
        "Calculadora gratuita de porcentaje de grasa corporal usando el método U.S. Navy. Obtén tu resultado al instante ingresando altura, cintura y cuello.",
      applicationCategory: "HealthApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      inLanguage: "es",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Cómo mido mi cintura correctamente?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mide horizontalmente a la altura del ombligo. Relaja el abdomen y no metas el estómago. Usa una cinta métrica flexible no elástica.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo mido mi cuello para la calculadora?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mide en la parte más estrecha del cuello, justo debajo de la nuez de Adán, con la cabeza en posición neutral.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué es el método U.S. Navy para calcular la grasa corporal?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El método U.S. Navy estima el porcentaje de grasa corporal a partir de medidas de circunferencia (cintura, cuello y cadera en mujeres) y la altura. Es uno de los métodos más precisos y accesibles sin necesitar equipos especializados.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuál es el porcentaje de grasa corporal saludable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Según el American Council on Exercise (ACE): Hombres — Atleta: 6-13%, En forma: 14-17%, Aceptable: 18-24%, Obesidad: +25%. Mujeres — Atleta: 14-20%, En forma: 21-24%, Aceptable: 25-31%, Obesidad: +32%.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cuándo es el mejor momento para medirme?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mide por la mañana, en ayunas y antes de hacer ejercicio. Los resultados son más consistentes y comparables en esas condiciones.",
          },
        },
      ],
    },
  ],
}

const GUIDE_ITEMS = [
  { id: "guia-altura",  title: "Altura",          icon: "↕", desc: "Párate descalzo contra una pared recta. Mide desde el suelo hasta la parte más alta de tu cabeza." },
  { id: "guia-cintura", title: "Cintura",          icon: "◯", desc: "Mide horizontalmente a la altura del ombligo. Relaja el abdomen, no metas el estómago." },
  { id: "guia-cuello",  title: "Cuello",           icon: "⌒", desc: "Mide en la parte más estrecha del cuello, justo debajo de la nuez de Adán. Cabeza en posición neutral." },
  { id: "guia-cadera",  title: "Cadera (mujeres)", icon: "◡", desc: "Mide en la parte más ancha de las caderas y glúteos, con los pies juntos." },
  { id: "guia-momento", title: "Momento ideal",    icon: "☀", desc: "Mide por la mañana, en ayunas, antes de hacer ejercicio. Los resultados son más consistentes." },
  { id: "guia-tips",    title: "Precisión",        icon: "✓", desc: "Usa una cinta métrica flexible no elástica. Toma cada medida 2-3 veces y usa el promedio." },
]

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main style={{ background: "#0A0A0A", minHeight: "100vh" }}>
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#AAFF00" }}>
              Calculadora
            </p>
            <h1
              className="font-display leading-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#FAFAFA" }}
            >
              Mide tu composición corporal
            </h1>
            <p className="text-base mt-3 max-w-xl" style={{ color: "#666" }}>
              Ingresa tus medidas y obtén tu porcentaje de grasa corporal
              con el método U.S. Navy.
            </p>
          </div>

          <CalculatorShell />

          {/* Measurement Guide */}
          <div className="mt-16">
            <div
              className="h-px mb-10"
              style={{ background: "linear-gradient(90deg, transparent, #2a2a2a, transparent)" }}
            />
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#AAFF00" }}>
                Guía
              </p>
              <h2 className="font-display text-3xl" style={{ color: "#FAFAFA" }}>
                ¿Cómo medir correctamente?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {GUIDE_ITEMS.map((tip) => (
                <div
                  key={tip.id}
                  id={tip.id}
                  className="p-5 rounded-xl scroll-mt-24"
                  style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}
                >
                  <div className="font-display text-2xl mb-3" style={{ color: "#AAFF00" }}>{tip.icon}</div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "#FAFAFA" }}>{tip.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#555" }}>{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
