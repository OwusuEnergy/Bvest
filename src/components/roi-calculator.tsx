"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { predictRoiAction } from "@/actions/predict-roi";
import { type InvestmentROIPredictionOutput } from "@/ai/flows/investment-roi-prediction";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const formSchema = z.object({
  carType: z.string().min(1, { message: "Please select a car type." }),
  investmentDuration: z.coerce.number().min(1, { message: "Duration must be at least 1 month." }),
  marketTrends: z.string().min(10, { message: "Please describe market trends briefly." }),
  amount: z.coerce.number().min(100, { message: "Minimum investment is GHS 100." }),
});

type FormValues = z.infer<typeof formSchema>;

export function RoiCalculator() {
  const [prediction, setPrediction] = useState<InvestmentROIPredictionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carType: "",
      investmentDuration: 12,
      marketTrends: "Stable demand for ride-hailing services in urban centers.",
      amount: 1000,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await predictRoiAction(values);
      setPrediction(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-accent" />
          Automated ROI Calculator
        </CardTitle>
        <FormDescription>
          Use our AI-powered tool to predict potential returns on your car investment.
        </FormDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Amount (GHS)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 1000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="investmentDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Duration (Months)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="carType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Car Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a car type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                      <SelectItem value="Van">Van</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marketTrends"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Market Trends</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., High demand for SUVs in urban areas"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                "Predict ROI"
              )}
            </Button>
          </form>
        </Form>

        {prediction && (
          <Alert className="mt-6 border-primary bg-primary/5">
            <Sparkles className="h-4 w-4 !text-primary" />
            <AlertTitle className="font-headline text-primary">AI Prediction Result</AlertTitle>
            <AlertDescription className="mt-2">
              <div className="flex items-baseline gap-4">
                <span className="text-sm text-muted-foreground">Predicted ROI:</span>
                <p className="text-3xl font-bold font-headline text-primary">
                  {prediction.predictedROI.toFixed(2)}%
                </p>
              </div>
              <p className="mt-4 text-sm text-muted-foreground italic">
                <strong className="not-italic">Reasoning:</strong> {prediction.reasoning}
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
