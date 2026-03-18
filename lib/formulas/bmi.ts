import type { BMIInputs, BodyFatResult } from "../types"
import { getCategory } from "../types"

export function calculateBMI(inputs: BMIInputs): BodyFatResult {
  const { sex, height, weight, age } = inputs
  const heightM = height / 100
  const bmi = weight / (heightM * heightM)

  let percentage: number
  if (sex === "male") {
    // BF% = (1.20 * BMI) + (0.23 * age) - 16.2
    percentage = 1.20 * bmi + 0.23 * age - 16.2
  } else {
    // BF% = (1.20 * BMI) + (0.23 * age) - 5.4
    percentage = 1.20 * bmi + 0.23 * age - 5.4
  }

  percentage = Math.round(percentage * 10) / 10
  const { label, color } = getCategory(percentage, sex)

  return {
    percentage,
    category: label,
    categoryColor: color,
    method: "bmi",
    bmi: Math.round(bmi * 10) / 10,
  }
}

export function validateBMI(inputs: Partial<BMIInputs>): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!inputs.height || inputs.height < 100 || inputs.height > 250) {
    errors.height = "Altura debe estar entre 100 y 250 cm"
  }
  if (!inputs.weight || inputs.weight < 20 || inputs.weight > 300) {
    errors.weight = "Peso debe estar entre 20 y 300 kg"
  }
  if (!inputs.age || inputs.age < 15 || inputs.age > 100) {
    errors.age = "Edad debe estar entre 15 y 100 años"
  }

  return errors
}
