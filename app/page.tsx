"use client"

import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { CATEGORIES } from "@/lib/types"

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main style={{ background: "#0A0A0A", minHeight: "100vh" }}>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-40 pb-24">
          <div className="flex flex-col items-start gap-8 max-w-3xl">
            {/* Eyebrow */}
            <div
              className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase"
              style={{
                border: "1px solid rgba(170,255,0,0.3)",
                color: "#AAFF00",
                background: "rgba(170,255,0,0.06)",
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: "#AAFF00" }}
              />
              Calculadora científica gratuita
            </div>

            {/* Headline */}
            <h1
              className="animate-fade-up delay-100 font-display leading-none tracking-tight"
              style={{ fontSize: "clamp(3rem, 8vw, 6rem)", color: "#FAFAFA" }}
            >
              Conoce tu{" "}
              <span
                style={{
                  color: "#AAFF00",
                  textShadow: "0 0 40px rgba(170,255,0,0.4)",
                }}
              >
                composición
              </span>{" "}
              corporal real
            </h1>

            {/* Subhead */}
            <p
              className="animate-fade-up delay-200 text-lg leading-relaxed max-w-xl"
              style={{ color: "#888" }}
            >
              Calcula tu porcentaje de grasa corporal con los métodos U.S. Navy
              e IMC. Sin registro, sin suscripciones. Solo resultados.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4">
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200"
                style={{ background: "#AAFF00", color: "#0A0A0A" }}
              >
                Calcular ahora
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>

              <Link
                href="/ai-analysis"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-medium text-base transition-all duration-200"
                style={{
                  border: "1px solid #2a2a2a",
                  color: "#FAFAFA",
                  background: "transparent",
                }}
              >
                <span style={{ color: "#AAFF00" }}>✦</span>
                Análisis con IA
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="animate-fade-up delay-400 mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "2", label: "Métodos validados" },
              { value: "4", label: "Categorías ACE" },
              { value: "100%", label: "Gratis siempre" },
              { value: "0", label: "Datos almacenados" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-2xl"
                style={{ border: "1px solid #2a2a2a", background: "#111" }}
              >
                <div className="font-display text-4xl" style={{ color: "#AAFF00" }}>
                  {stat.value}
                </div>
                <div className="text-sm mt-1" style={{ color: "#666" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          style={{ borderTop: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", background: "#0d0d0d" }}
          className="py-20"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#AAFF00" }}>
                Proceso
              </p>
              <h2 className="font-display text-4xl" style={{ color: "#FAFAFA" }}>
                Tres pasos, un resultado
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "01",
                  title: "Elige el método",
                  desc: "Selecciona entre U.S. Navy (más preciso) o IMC (más simple). Ambos están validados científicamente.",
                },
                {
                  step: "02",
                  title: "Ingresa tus medidas",
                  desc: "Altura, cintura y cuello. El sistema convierte automáticamente entre métrico e imperial.",
                },
                {
                  step: "03",
                  title: "Obtén tu resultado",
                  desc: "Tu porcentaje exacto, categoría según el American Council on Exercise, y comparativa de rangos.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-8 rounded-2xl"
                  style={{ border: "1px solid #2a2a2a", background: "#111" }}
                >
                  <div className="font-display text-6xl mb-6" style={{ color: "#1e1e1e" }}>
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-3" style={{ color: "#FAFAFA" }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories reference */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-12">
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: "#AAFF00" }}>
                Referencia ACE
              </p>
              <h2 className="font-display text-4xl" style={{ color: "#FAFAFA" }}>
                ¿Qué significa tu porcentaje?
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className="p-6 rounded-2xl"
                  style={{
                    border: `1px solid ${cat.color}33`,
                    background: `${cat.color}08`,
                  }}
                >
                  <div className="w-3 h-3 rounded-full mb-4" style={{ background: cat.color }} />
                  <h3 className="font-semibold text-xl mb-3" style={{ color: cat.color }}>
                    {cat.label}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#666" }}>Hombres</span>
                      <span style={{ color: "#FAFAFA" }}>
                        {cat.range.male[0]}–{cat.range.male[1] === 100 ? cat.range.male[0] + "%+" : cat.range.male[1] + "%"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#666" }}>Mujeres</span>
                      <span style={{ color: "#FAFAFA" }}>
                        {cat.range.female[0]}–{cat.range.female[1] === 100 ? cat.range.female[0] + "%+" : cat.range.female[1] + "%"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="pb-24">
          <div className="max-w-6xl mx-auto px-6">
            <div
              className="p-12 rounded-3xl text-center"
              style={{
                background: "linear-gradient(135deg, #111 0%, #0d1a00 100%)",
                border: "1px solid rgba(170,255,0,0.2)",
              }}
            >
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: "#FAFAFA" }}>
                Empieza ahora,{" "}
                <span style={{ color: "#AAFF00" }}>gratis</span>
              </h2>
              <p className="text-base mb-8" style={{ color: "#666" }}>
                Sin registro. Sin tarjeta. Solo resultados reales.
              </p>
              <Link
                href="/calculator"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-base transition-all duration-200"
                style={{ background: "#AAFF00", color: "#0A0A0A" }}
              >
                Ir a la calculadora
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
