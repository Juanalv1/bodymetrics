import type { NavyInputs, BodyFatResult } from "../types"
import { getCategory } from "../types"

export function calculateNavy(inputs: NavyInputs): BodyFatResult {
  const { sex, height, waist, neck, hip } = inputs
  let percentage: number

  if (sex === "male") {
    // BF% = 86.010 * log10(abdomen - neck) - 70.041 * log10(height) + 36.76
    percentage = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
  } else {
    // BF% = 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
    const hipValue = hip ?? 0
    percentage = 163.205 * Math.log10(waist + hipValue - neck) - 97.684 * Math.log10(height) - 78.387
  }

  percentage = Math.round(percentage * 10) / 10
  const { label, color } = getCategory(percentage, sex)

  return {
    percentage,
    category: label,
    categoryColor: color,
    method: "navy",
  }
}

export function validateNavy(inputs: Partial<NavyInputs>): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!inputs.height || inputs.height < 100 || inputs.height > 250) {
    errors.height = "Altura debe estar entre 100 y 250 cm"
  }
  if (!inputs.waist || inputs.waist < 40 || inputs.waist > 200) {
    errors.waist = "Cintura debe estar entre 40 y 200 cm"
  }
  if (!inputs.neck || inputs.neck < 20 || inputs.neck > 80) {
    errors.neck = "Cuello debe estar entre 20 y 80 cm"
  }
  if (inputs.sex === "female") {
    if (!inputs.hip || inputs.hip < 40 || inputs.hip > 200) {
      errors.hip = "Cadera debe estar entre 40 y 200 cm"
    }
    if (inputs.waist && inputs.hip && inputs.neck && (inputs.waist + inputs.hip - inputs.neck) <= 0) {
      errors.waist = "Los valores ingresados no son válidos"
    }
  } else {
    if (inputs.waist && inputs.neck && inputs.waist <= inputs.neck) {
      errors.waist = "La cintura debe ser mayor al cuello"
    }
  }

  return errors
}
