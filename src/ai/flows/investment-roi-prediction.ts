'use server';

/**
 * @fileOverview This file defines a Genkit flow for predicting the potential ROI for car investments.
 *
 * The flow takes into account car type, investment duration, and market trends to provide an AI-powered ROI prediction.
 *
 * @module src/ai/flows/investment-roi-prediction
 *
 * @interface InvestmentROIPredictionInput - The input type for the investmentROIPrediction function.
 *
 * @interface InvestmentROIPredictionOutput - The output type for the investmentROIPrediction function.
 *
 * @function investmentROIPrediction - The main function that triggers the ROI prediction flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestmentROIPredictionInputSchema = z.object({
  carType: z.string().describe('The type of car being invested in.'),
  investmentDuration: z
    .number()
    .describe('The duration of the investment in months.'),
  marketTrends: z.string().describe('The current trends in the car rental market.'),
  amount: z.number().describe('The amount being invested.'),
});
export type InvestmentROIPredictionInput = z.infer<
  typeof InvestmentROIPredictionInputSchema
>;

const InvestmentROIPredictionOutputSchema = z.object({
  predictedROI: z
    .number()
    .describe('The predicted ROI for the investment as a percentage.'),
  reasoning: z.string().describe('The reasoning behind the predicted ROI.'),
});
export type InvestmentROIPredictionOutput = z.infer<
  typeof InvestmentROIPredictionOutputSchema
>;

export async function investmentROIPrediction(input: InvestmentROIPredictionInput): Promise<InvestmentROIPredictionOutput> {
  return investmentROIPredictionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'investmentROIPredictionPrompt',
  input: {schema: InvestmentROIPredictionInputSchema},
  output: {schema: InvestmentROIPredictionOutputSchema},
  prompt: `You are an expert in predicting the return on investment (ROI) for car rental investments.

  Based on the car type, investment duration, market trends and amount invested, provide a predicted ROI as a percentage.

  Explain the reasoning behind your prediction.

  Car Type: {{{carType}}}
  Investment Duration (months): {{{investmentDuration}}}
  Market Trends: {{{marketTrends}}}
  Amount Invested: {{{amount}}}
  `,
});

const investmentROIPredictionFlow = ai.defineFlow(
  {
    name: 'investmentROIPredictionFlow',
    inputSchema: InvestmentROIPredictionInputSchema,
    outputSchema: InvestmentROIPredictionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
