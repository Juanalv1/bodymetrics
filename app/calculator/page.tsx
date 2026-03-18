"use client"

import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import MeasurementsForm from "@/components/calculator/MeasurementsForm"
import ResultsPanel from "@/components/calculator/ResultsPanel"
import type { BodyFatResult, Sex } from "@/lib/types"

export default function CalculatorPage() {
  const [result, setResult] = useState<BodyFatResult | null>(null)
  const [sex, setSex] = useState<Sex>("male")

  function handleResult(res: BodyFatResult, s: Sex) {
    setSex(s)
    setResult(res)
    // Scroll to results on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById("results-panel")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }

  return (
    <>
      <Navbar />

      <main style={{ background: "#0A0A0A", minHeight: "100vh" }}>
        <div className="max-w-6xl mx-auto px-6 pt-28 pb-20">
          {/* Header */}
          <div className="mb-10">
            <p
              className="text-xs uppercase tracking-widest mb-3"
              style={{ color: "#AAFF00" }}
            >
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
              según el método U.S. Navy o IMC.
            </p>
          </div>

          {/* Two-column layout */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left — Form */}
            <div
              className="p-6 md:p-8 rounded-2xl"
              style={{ border: "1px solid #2a2a2a", background: "#0d0d0d" }}
            >
              <MeasurementsForm onResult={handleResult} />
            </div>

            {/* Right — Results */}
            <div id="results-panel">
              {result ? (
                <ResultsPanel result={result} sex={sex} />
              ) : (
                <EmptyState />
              )}
            </div>
          </div>

          {/* How to measure guide */}
          <MeasurementGuide />
        </div>
      </main>

      <Footer />
    </>
  )
}

function EmptyState() {
  return (
    <div
      className="h-full min-h-80 flex flex-col items-center justify-center p-10 rounded-2xl text-center"
      style={{
        border: "1px dashed #2a2a2a",
        background: "rgba(170,255,0,0.01)",
      }}
    >
      {/* Gauge placeholder illustration */}
      <svg viewBox="0 0 200 120" className="w-40 mb-6 opacity-20">
        <path
          d="M 160 100 A 80 80 0 0 0 40 100"
          fill="none"
          stroke="#AAFF00"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <circle cx="100" cy="100" r="6" fill="#AAFF00" />
      </svg>

      <p className="text-sm font-medium mb-1" style={{ color: "#555" }}>
        Tu resultado aparecerá aquí
      </p>
      <p className="text-xs" style={{ color: "#3a3a3a" }}>
        Completa el formulario y presiona "Calcular"
      </p>
    </div>
  )
}

function MeasurementGuide() {
  return (
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
        {[
          {
            title: "Altura",
            icon: "↕",
            desc: "Párate descalzo contra una pared recta. Mide desde el suelo hasta la parte más alta de tu cabeza.",
          },
          {
            title: "Cintura",
            icon: "◯",
            desc: "Mide horizontalmente a la altura del ombligo. Relaja el abdomen, no metas el estómago.",
          },
          {
            title: "Cuello",
            icon: "⌒",
            desc: "Mide en la parte más estrecha del cuello, justo debajo de la nuez de Adán. Cabeza en posición neutral.",
          },
          {
            title: "Cadera (mujeres)",
            icon: "◡",
            desc: "Mide en la parte más ancha de las caderas y glúteos, con los pies juntos.",
          },
          {
            title: "Momento ideal",
            icon: "☀",
            desc: "Mide por la mañana, en ayunas, antes de hacer ejercicio. Los resultados son más consistentes.",
          },
          {
            title: "Precisión",
            icon: "✓",
            desc: "Usa una cinta métrica flexible no elástica. Toma cada medida 2-3 veces y usa el promedio.",
          },
        ].map((tip) => (
          <div
            key={tip.title}
            className="p-5 rounded-xl"
            style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}
          >
            <div
              className="font-display text-2xl mb-3"
              style={{ color: "#AAFF00" }}
            >
              {tip.icon}
            </div>
            <h3 className="text-sm font-semibold mb-2" style={{ color: "#FAFAFA" }}>
              {tip.title}
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "#555" }}>
              {tip.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
