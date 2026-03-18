"use client"

import Link from "next/link"
import type { BodyFatResult, Sex } from "@/lib/types"
import { CATEGORIES } from "@/lib/types"
import BodyFatGauge from "./BodyFatGauge"

interface ResultsPanelProps {
  result: BodyFatResult
  sex: Sex
}

export default function ResultsPanel({ result, sex }: ResultsPanelProps) {
  const { percentage, category, categoryColor, method, bmi } = result

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Gauge */}
      <div
        className="p-6 rounded-2xl"
        style={{ border: "1px solid #2a2a2a", background: "#111" }}
      >
        <BodyFatGauge percentage={percentage} sex={sex} color={categoryColor} />

        {/* Category badge */}
        <div className="flex justify-center mt-4">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{
              background: `${categoryColor}18`,
              border: `1px solid ${categoryColor}44`,
              color: categoryColor,
            }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: categoryColor }}
            />
            {category}
          </span>
        </div>

        {/* BMI if available */}
        {bmi && (
          <div className="mt-4 flex justify-center">
            <div className="text-center">
              <div className="text-xs uppercase tracking-widest mb-1" style={{ color: "#555" }}>
                IMC calculado
              </div>
              <div className="font-display text-2xl" style={{ color: "#FAFAFA" }}>
                {bmi}
                <span className="text-base ml-1" style={{ color: "#666" }}>kg/m²</span>
              </div>
            </div>
          </div>
        )}

        {/* Method indicator */}
        <div className="mt-3 flex justify-center">
          <span className="text-xs" style={{ color: "#444" }}>
            Método:{" "}
            <span style={{ color: "#666" }}>
              {method === "navy" ? "U.S. Navy" : "IMC / Deurenberg"}
            </span>
          </span>
        </div>
      </div>

      {/* Reference table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid #2a2a2a" }}
      >
        <div
          className="px-5 py-3"
          style={{ background: "#181818", borderBottom: "1px solid #2a2a2a" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#666" }}>
            Rangos de referencia ACE — {sex === "male" ? "Hombres" : "Mujeres"}
          </p>
        </div>

        <div style={{ background: "#111" }}>
          {CATEGORIES.map((cat) => {
            const [min, max] = cat.range[sex]
            const isCurrent = category === cat.label
            return (
              <div
                key={cat.label}
                className="flex items-center justify-between px-5 py-3 transition-colors"
                style={{
                  background: isCurrent ? `${cat.color}10` : "transparent",
                  borderLeft: isCurrent ? `3px solid ${cat.color}` : "3px solid transparent",
                  borderBottom: "1px solid #1a1a1a",
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: cat.color }}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: isCurrent ? cat.color : "#888" }}
                  >
                    {cat.label}
                  </span>
                </div>
                <span
                  className="text-sm font-medium tabular-nums"
                  style={{ color: isCurrent ? cat.color : "#555" }}
                >
                  {min}–{max === 100 ? min + "%+" : max + "%"}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Interpretation */}
      <InterpretationCard percentage={percentage} category={category} color={categoryColor} sex={sex} />

      {/* AI CTA */}
      <Link
        href="/ai-analysis"
        className="flex items-center justify-between px-5 py-4 rounded-2xl group transition-all duration-200"
        style={{
          border: "1px solid rgba(170,255,0,0.2)",
          background: "rgba(170,255,0,0.04)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(170,255,0,0.5)"
          e.currentTarget.style.background = "rgba(170,255,0,0.08)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(170,255,0,0.2)"
          e.currentTarget.style.background = "rgba(170,255,0,0.04)"
        }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: "#AAFF00" }}>
            ✦ Análisis visual con IA
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#666" }}>
            Sube una foto para complementar tu resultado
          </p>
        </div>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#AAFF00"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="flex-shrink-0 transition-transform group-hover:translate-x-1"
        >
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </Link>
    </div>
  )
}

function InterpretationCard({
  percentage,
  category,
  color,
  sex,
}: {
  percentage: number
  category: string
  color: string
  sex: Sex
}) {
  const messages: Record<string, { title: string; body: string }> = {
    Atleta: {
      title: "Nivel atlético",
      body: "Tu grasa corporal está en rangos de competición. Asegúrate de mantener suficiente grasa esencial para una función hormonal óptima.",
    },
    "En forma": {
      title: "Excelente condición",
      body: "Estás en una categoría de alta condición física. Tu composición corporal favorece el rendimiento y la salud cardiovascular.",
    },
    Aceptable: {
      title: "Rango saludable",
      body: "Tu grasa corporal está en un rango aceptable. Con hábitos de ejercicio y alimentación podrías mejorar hacia la categoría 'En forma'.",
    },
    Obesidad: {
      title: "Atención recomendada",
      body: "Tu porcentaje supera los rangos saludables. Te recomendamos consultar con un profesional de la salud o nutricionista para un plan personalizado.",
    },
  }

  const msg = messages[category] ?? messages["Aceptable"]

  return (
    <div
      className="p-5 rounded-2xl"
      style={{
        border: `1px solid ${color}22`,
        background: `${color}06`,
      }}
    >
      <p className="text-sm font-semibold mb-1.5" style={{ color }}>
        {msg.title}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "#777" }}>
        {msg.body}
      </p>
    </div>
  )
}
