"use client"

import { useState } from "react"
import type { Sex, UnitSystem, NavyInputs, BodyFatResult } from "@/lib/types"
import { calculateNavy, validateNavy } from "@/lib/formulas"

interface MeasurementsFormProps {
  onResult: (result: BodyFatResult, sex: Sex) => void
}

const inToCm = (inch: number) => Math.round(inch * 2.54 * 10) / 10

const RulerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"/>
    <path d="m7.5 10.5 2 2M10.5 7.5l2 2M13.5 4.5l2 2M4.5 13.5l2 2"/>
  </svg>
)

function HowToLink({ guideAnchor }: { guideAnchor: string }) {
  return (
    <a
      href={guideAnchor}
      className="text-xs transition-colors"
      style={{ color: "#AAFF00", opacity: 0.7, textDecoration: "none" }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
      onClick={(e) => {
        e.preventDefault()
        document.querySelector(guideAnchor)?.scrollIntoView({ behavior: "smooth", block: "center" })
      }}
    >
      ¿Cómo medir?
    </a>
  )
}

function FieldInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  unit,
  id,
  guideAnchor,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  placeholder: string
  unit: string
  id: string
  guideAnchor?: string
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="text-sm font-medium flex items-center gap-1.5"
          style={{ color: "#FAFAFA" }}
        >
          <span style={{ color: "#555" }}><RulerIcon /></span>
          {label}
        </label>
        {guideAnchor && <HowToLink guideAnchor={guideAnchor} />}
      </div>
      {hint && (
        <p className="text-xs" style={{ color: "#555" }}>{hint}</p>
      )}
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-14 rounded-xl text-base transition-all duration-200"
          style={{
            background: "#111",
            border: `1px solid ${error ? "#EF4444" : "#2a2a2a"}`,
            color: "#FAFAFA",
            outline: "none",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error ? "#EF4444" : "#AAFF00"
            e.currentTarget.style.boxShadow = error
              ? "0 0 0 3px rgba(239,68,68,0.15)"
              : "0 0 0 3px rgba(170,255,0,0.1)"
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "#EF4444" : "#2a2a2a"
            e.currentTarget.style.boxShadow = "none"
          }}
        />
        <span
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium pointer-events-none"
          style={{ color: "#555" }}
        >
          {unit}
        </span>
      </div>
      {error && (
        <p className="text-xs" style={{ color: "#EF4444" }}>{error}</p>
      )}
    </div>
  )
}

export default function MeasurementsForm({ onResult }: MeasurementsFormProps) {
  const [sex, setSex] = useState<Sex>("male")
  const [units, setUnits] = useState<UnitSystem>("metric")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [waist, setWaist] = useState("")
  const [neck, setNeck] = useState("")
  const [hip, setHip] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const uLen = units === "metric" ? "cm" : "in"
  const uWeight = units === "metric" ? "kg" : "lb"

  function parseDecimal(val: string): number {
    return parseFloat(val.replace(",", "."))
  }

  function toInternal(val: string): number {
    const n = parseDecimal(val)
    if (isNaN(n)) return 0
    return units === "imperial" ? inToCm(n) : n
  }

  function toKg(val: string): number | undefined {
    const n = parseDecimal(val)
    if (isNaN(n) || n <= 0) return undefined
    return units === "imperial" ? Math.round(n * 0.453592 * 10) / 10 : n
  }

  function handleCalculate() {
    const weightKg = toKg(weight)
    const inputs: NavyInputs = {
      sex,
      height: toInternal(height),
      waist: toInternal(waist),
      neck: toInternal(neck),
      ...(sex === "female" ? { hip: toInternal(hip) } : {}),
      ...(weightKg !== undefined ? { weight: weightKg } : {}),
    }
    const errs = validateNavy(inputs)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const result = calculateNavy(inputs)
    const finalErrs: Record<string, string> = {}
    if (result.percentage < 3 || result.percentage > 70) {
      finalErrs.general = "Resultado fuera del rango normal. Verifica tus medidas."
    }
    setErrors(finalErrs)
    onResult(result, sex)
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "10px 16px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    border: "none",
    background: active ? "#AAFF00" : "transparent",
    color: active ? "#0A0A0A" : "#666",
  })

  const sexBtnStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    border: `1px solid ${active ? "#AAFF00" : "#2a2a2a"}`,
    background: active ? "rgba(170,255,0,0.1)" : "transparent",
    color: active ? "#AAFF00" : "#555",
  })

  return (
    <div className="flex flex-col gap-5">
      {/* Unit toggle */}
      <div
        className="flex p-1 rounded-xl"
        style={{ background: "#0A0A0A", border: "1px solid #2a2a2a" }}
      >
        <button style={tabStyle(units === "metric")} onClick={() => setUnits("metric")}>
          Métrico (cm)
        </button>
        <button style={tabStyle(units === "imperial")} onClick={() => setUnits("imperial")}>
          Imperial (in)
        </button>
      </div>

      {/* Sex selector */}
      <div className="flex gap-3">
        <button style={sexBtnStyle(sex === "male")} onClick={() => setSex("male")}>
          ♂ Masculino
        </button>
        <button style={sexBtnStyle(sex === "female")} onClick={() => setSex("female")}>
          ♀ Femenino
        </button>
      </div>

      <div style={{ height: "1px", background: "#1e1e1e" }} />

      {/* Fields */}
      <div className="flex flex-col gap-4">
        <FieldInput
          id="height"
          label="Altura"
          value={height}
          onChange={setHeight}
          error={errors.height}
          placeholder={units === "metric" ? "175" : "69"}
          unit={uLen}
          guideAnchor="#guia-altura"
        />
        <FieldInput
          id="weight"
          label="Peso (opcional)"
          value={weight}
          onChange={setWeight}
          placeholder={units === "metric" ? "70" : "154"}
          unit={uWeight}
          hint="Para calcular masa grasa y magra en kg"
        />
        <FieldInput
          id="waist"
          label="Cintura"
          value={waist}
          onChange={setWaist}
          error={errors.waist}
          placeholder={units === "metric" ? "82" : "32"}
          unit={uLen}
          guideAnchor="#guia-cintura"
          hint="A la altura del ombligo"
        />
        <FieldInput
          id="neck"
          label="Cuello"
          value={neck}
          onChange={setNeck}
          error={errors.neck}
          placeholder={units === "metric" ? "38" : "15"}
          unit={uLen}
          guideAnchor="#guia-cuello"
          hint="En la parte más estrecha"
        />
        {sex === "female" && (
          <FieldInput
            id="hip"
            label="Cadera"
            value={hip}
            onChange={setHip}
            error={errors.hip}
            placeholder={units === "metric" ? "95" : "37"}
            unit={uLen}
            guideAnchor="#guia-cadera"
            hint="En la parte más ancha"
          />
        )}
      </div>

      {errors.general && (
        <div
          className="px-4 py-3 rounded-xl text-sm"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#EF4444",
          }}
        >
          ⚠ {errors.general}
        </div>
      )}

      <button
        onClick={handleCalculate}
        className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200"
        style={{ background: "#AAFF00", color: "#0A0A0A" }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#bbff33"
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(170,255,0,0.3)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#AAFF00"
          e.currentTarget.style.boxShadow = "none"
        }}
      >
        Calcular →
      </button>
    </div>
  )
}
