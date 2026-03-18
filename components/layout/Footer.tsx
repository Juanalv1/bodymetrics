"use client"

import Link from "next/link"

export default function Footer() {
  return (
    <footer
      style={{ borderTop: "1px solid #2a2a2a" }}
      className="mt-24 py-10"
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-display text-lg" style={{ color: "#FAFAFA" }}>
          Body<span style={{ color: "#AAFF00" }}>Metrics</span>
        </p>

        <p className="text-sm" style={{ color: "#555" }}>
          Los resultados son estimaciones. Consulta a un profesional de la salud.
        </p>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{ color: "#555" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#AAFF00")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            Calculadora
          </Link>
          <Link
            href="/ai-analysis"
            className="text-sm transition-colors"
            style={{ color: "#555" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#AAFF00")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            Análisis IA
          </Link>
        </div>
      </div>
    </footer>
  )
}
