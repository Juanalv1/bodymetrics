export type Sex = "male" | "female"
export type UnitSystem = "metric" | "imperial"
export type CalculationMethod = "navy" | "bmi"

export interface NavyInputs {
  sex: Sex
  height: number   // cm
  waist: number    // cm
  neck: number     // cm
  hip?: number     // cm — solo mujeres
}

export interface BMIInputs {
  sex: Sex
  height: number   // cm
  weight: number   // kg
  age: number
}

export interface BodyFatResult {
  percentage: number
  category: string
  categoryColor: string
  method: CalculationMethod
  bmi?: number
}

export interface BodyFatCategory {
  label: string
  color: string
  range: { male: [number, number]; female: [number, number] }
}

export const CATEGORIES: BodyFatCategory[] = [
  { label: "Atleta",    color: "#3B82F6", range: { male: [2, 13],   female: [10, 20] } },
  { label: "En forma",  color: "#22C55E", range: { male: [14, 17],  female: [21, 24] } },
  { label: "Aceptable", color: "#EAB308", range: { male: [18, 24],  female: [25, 31] } },
  { label: "Obesidad",  color: "#EF4444", range: { male: [25, 100], female: [32, 100] } },
]

export function getCategory(percentage: number, sex: Sex): { label: string; color: string } {
  for (const cat of CATEGORIES) {
    const [min, max] = cat.range[sex]
    if (percentage >= min && percentage <= max) {
      return { label: cat.label, color: cat.color }
    }
  }
  return { label: "Obesidad", color: "#EF4444" }
}
