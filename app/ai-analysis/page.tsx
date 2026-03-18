import type { Metadata } from "next"
import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Análisis de Grasa Corporal con IA — Próximamente",
  description:
    "Próximamente: análisis visual de composición corporal con inteligencia artificial. Por ahora usa nuestra calculadora gratuita con el método U.S. Navy.",
  robots: { index: false, follow: true },
}

export default function AIAnalysisPage() {
  return (
    <>
      <Navbar />

      <main
        style={{ background: "#0A0A0A", minHeight: "100vh" }}
        className="flex flex-col items-center justify-center px-6"
      >
        <div className="flex flex-col items-center text-center max-w-lg">
          {/* Animated icon */}
          <div className="relative mb-10">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(170,255,0,0.06)",
                border: "1px solid rgba(170,255,0,0.2)",
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#AAFF00"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ opacity: 0.8 }}
              >
                <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4Z"/>
                <circle cx="12" cy="13" r="2"/>
              </svg>
            </div>
            {/* Pulse ring */}
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: "transparent",
                border: "1px solid rgba(170,255,0,0.15)",
                animationDuration: "2.5s",
              }}
            />
          </div>

          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase mb-6"
            style={{
              border: "1px solid rgba(170,255,0,0.3)",
              color: "#AAFF00",
              background: "rgba(170,255,0,0.06)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            En desarrollo
          </span>

          <h1
            className="font-display leading-tight mb-4"
            style={{ fontSize: "clamp(2.2rem, 6vw, 3.5rem)", color: "#FAFAFA" }}
          >
            Próximamente
          </h1>

          <p className="text-base leading-relaxed mb-10" style={{ color: "#666" }}>
            El análisis de composición corporal por imagen con IA está en construcción.
            Por ahora, usa la calculadora por medidas para obtener tu resultado.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200"
            style={{ background: "#AAFF00", color: "#0A0A0A" }}
          >
            Ir a la calculadora
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  )
}
