import type { NavyInputs, BodyFatResult } from "../types"
import { getCategory } from "../types"

export function calculateNavy(inputs: NavyInputs): BodyFatResult {
  const { sex, height, waist, neck, hip } = inputs
  let percentage: number

  if (sex === "male") {
    // Hodgdon & Beckett (NHRC): BD = 1.0324 - 0.19077×log10(waist-neck) + 0.15456×log10(height)
    // BF% = 495 / BD - 450
    const bd = 1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)
    percentage = 495 / bd - 450
  } else {
    // Hodgdon & Beckett (NHRC): BD = 1.29579 - 0.35004×log10(waist+hip-neck) + 0.22100×log10(height)
    // BF% = 495 / BD - 450
    const hipValue = hip ?? 0
    const bd = 1.29579 - 0.35004 * Math.log10(waist + hipValue - neck) + 0.22100 * Math.log10(height)
    percentage = 495 / bd - 450
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
