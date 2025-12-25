"use server";

import {
  investmentROIPrediction,
  type InvestmentROIPredictionInput,
  type InvestmentROIPredictionOutput,
} from "@/ai/flows/investment-roi-prediction";

export async function predictRoiAction(
  input: InvestmentROIPredictionInput
): Promise<InvestmentROIPredictionOutput> {
  try {
    const output = await investmentROIPrediction(input);
    return output;
  } catch (error) {
    console.error("Error in predictRoiAction:", error);
    throw new Error("Failed to predict ROI. Please try again.");
  }
}
