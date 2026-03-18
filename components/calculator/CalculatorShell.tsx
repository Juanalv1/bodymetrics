"use client"

import { useState } from "react"
import MeasurementsForm from "./MeasurementsForm"
import ResultsPanel from "./ResultsPanel"
import type { BodyFatResult, Sex } from "@/lib/types"

export default function CalculatorShell() {
  const [result, setResult] = useState<BodyFatResult | null>(null)
  const [sex, setSex] = useState<Sex>("male")

  function handleResult(res: BodyFatResult, s: Sex) {
    setSex(s)
    setResult(res)
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById("results-panel")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }
  }

  return (
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
  )
}

function EmptyState() {
  return (
    <div
      className="h-full min-h-80 flex flex-col items-center justify-center p-10 rounded-2xl text-center"
      style={{ border: "1px dashed #2a2a2a", background: "rgba(170,255,0,0.01)" }}
    >
      <svg viewBox="0 0 200 120" className="w-40 mb-6 opacity-20">
        <path d="M 160 100 A 80 80 0 0 0 40 100" fill="none" stroke="#AAFF00" strokeWidth="12" strokeLinecap="round" />
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
