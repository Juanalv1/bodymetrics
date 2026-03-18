"use client"

import { useState } from "react"
import type { Sex, UnitSystem, CalculationMethod, NavyInputs, BMIInputs, BodyFatResult } from "@/lib/types"
import { calculateNavy, validateNavy, calculateBMI, validateBMI } from "@/lib/formulas"

interface MeasurementsFormProps {
  onResult: (result: BodyFatResult, sex: Sex) => void
}

// Unit conversion helpers
const cmToIn = (cm: number) => Math.round(cm / 2.54 * 10) / 10
const inToCm = (inch: number) => Math.round(inch * 2.54 * 10) / 10
const kgToLb = (kg: number) => Math.round(kg * 2.205 * 10) / 10
const lbToKg = (lb: number) => Math.round(lb / 2.205 * 10) / 10

interface FormField {
  key: string
  label: string
  placeholder: string
  unit: string
  icon: React.ReactNode
}

const RulerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"/>
    <path d="m7.5 10.5 2 2M10.5 7.5l2 2M13.5 4.5l2 2M4.5 13.5l2 2"/>
  </svg>
)

const WeightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3"/><path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z"/>
  </svg>
)

const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
  </svg>
)

function FieldInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  unit,
  icon,
  id,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  placeholder: string
  unit: string
  icon: React.ReactNode
  id: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wider flex items-center gap-1.5"
        style={{ color: "#888" }}
      >
        <span style={{ color: "#666" }}>{icon}</span>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
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
  const [method, setMethod] = useState<CalculationMethod>("navy")

  // Navy fields (stored internally in cm)
  const [height, setHeight] = useState("")
  const [waist, setWaist] = useState("")
  const [neck, setNeck] = useState("")
  const [hip, setHip] = useState("")

  // BMI fields (stored internally in cm/kg)
  const [weight, setWeight] = useState("")
  const [age, setAge] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})

  const uLen = units === "metric" ? "cm" : "in"
  const uWt = units === "metric" ? "kg" : "lb"

  // Convert displayed value → internal cm/kg
  function toInternal(val: string, type: "length" | "weight"): number {
    const n = parseFloat(val)
    if (isNaN(n)) return 0
    if (units === "imperial") {
      return type === "length" ? inToCm(n) : lbToKg(n)
    }
    return n
  }

  function handleCalculate() {
    let result: BodyFatResult
    let errs: Record<string, string> = {}

    if (method === "navy") {
      const inputs: NavyInputs = {
        sex,
        height: toInternal(height, "length"),
        waist: toInternal(waist, "length"),
        neck: toInternal(neck, "length"),
        ...(sex === "female" ? { hip: toInternal(hip, "length") } : {}),
      }
      errs = validateNavy(inputs)
      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
      }
      result = calculateNavy(inputs)
    } else {
      const inputs: BMIInputs = {
        sex,
        height: toInternal(height, "length"),
        weight: toInternal(weight, "weight"),
        age: parseInt(age) || 0,
      }
      errs = validateBMI(inputs)
      if (Object.keys(errs).length > 0) {
        setErrors(errs)
        return
      }
      result = calculateBMI(inputs)
    }

    // Warn if extreme
    if (result.percentage < 3 || result.percentage > 70) {
      errs.general = "Resultado fuera del rango normal. Verifica tus medidas."
    }

    setErrors(errs)
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
    <div className="flex flex-col gap-6">
      {/* Unit system toggle */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#555" }}>
          Sistema de unidades
        </p>
        <div
          className="flex p-1 rounded-xl"
          style={{ background: "#111", border: "1px solid #2a2a2a" }}
        >
          <button
            style={tabStyle(units === "metric")}
            onClick={() => setUnits("metric")}
          >
            Métrico (cm/kg)
          </button>
          <button
            style={tabStyle(units === "imperial")}
            onClick={() => setUnits("imperial")}
          >
            Imperial (in/lb)
          </button>
        </div>
      </div>

      {/* Sex selector */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#555" }}>
          Sexo
        </p>
        <div className="flex gap-3">
          <button style={sexBtnStyle(sex === "male")} onClick={() => setSex("male")}>
            ♂ Masculino
          </button>
          <button style={sexBtnStyle(sex === "female")} onClick={() => setSex("female")}>
            ♀ Femenino
          </button>
        </div>
      </div>

      {/* Method selector */}
      <div>
        <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#555" }}>
          Método de cálculo
        </p>
        <div
          className="flex p-1 rounded-xl"
          style={{ background: "#111", border: "1px solid #2a2a2a" }}
        >
          <button
            style={tabStyle(method === "navy")}
            onClick={() => { setMethod("navy"); setErrors({}) }}
          >
            U.S. Navy ★
          </button>
          <button
            style={tabStyle(method === "bmi")}
            onClick={() => { setMethod("bmi"); setErrors({}) }}
          >
            IMC / BMI
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: "#555" }}>
          {method === "navy"
            ? "Requiere medidas corporales. Más preciso."
            : "Solo requiere peso, altura y edad."}
        </p>
      </div>

      {/* Divider */}
      <div style={{ height: "1px", background: "#1e1e1e" }} />

      {/* Fields */}
      <div className="flex flex-col gap-4">
        {/* Height — always */}
        <FieldInput
          id="height"
          label="Altura"
          value={height}
          onChange={setHeight}
          error={errors.height}
          placeholder={units === "metric" ? "175" : "69"}
          unit={uLen}
          icon={<RulerIcon />}
        />

        {method === "navy" ? (
          <>
            <FieldInput
              id="waist"
              label="Cintura (a nivel del ombligo)"
              value={waist}
              onChange={setWaist}
              error={errors.waist}
              placeholder={units === "metric" ? "82" : "32"}
              unit={uLen}
              icon={<RulerIcon />}
            />
            <FieldInput
              id="neck"
              label="Cuello (parte más estrecha)"
              value={neck}
              onChange={setNeck}
              error={errors.neck}
              placeholder={units === "metric" ? "38" : "15"}
              unit={uLen}
              icon={<RulerIcon />}
            />
            {sex === "female" && (
              <FieldInput
                id="hip"
                label="Cadera (parte más ancha)"
                value={hip}
                onChange={setHip}
                error={errors.hip}
                placeholder={units === "metric" ? "95" : "37"}
                unit={uLen}
                icon={<RulerIcon />}
              />
            )}
          </>
        ) : (
          <>
            <FieldInput
              id="weight"
              label="Peso"
              value={weight}
              onChange={setWeight}
              error={errors.weight}
              placeholder={units === "metric" ? "75" : "165"}
              unit={uWt}
              icon={<WeightIcon />}
            />
            <FieldInput
              id="age"
              label="Edad"
              value={age}
              onChange={setAge}
              error={errors.age}
              placeholder="30"
              unit="años"
              icon={<PersonIcon />}
            />
          </>
        )}
      </div>

      {/* General error */}
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

      {/* Submit */}
      <button
        onClick={handleCalculate}
        className="w-full py-4 rounded-xl font-semibold text-base transition-all duration-200 mt-2"
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
        Calcular mi grasa corporal →
      </button>
    </div>
  )
}
