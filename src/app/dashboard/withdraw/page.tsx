'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useFirestore, useUser } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection, serverTimestamp } from 'firebase/firestore';


const withdrawalFormSchema = z.object({
  amount: z.coerce.number().min(100, { message: 'Minimum withdrawal is GHS 100.' }),
  method: z.string().min(1, { message: 'Please select an account type.' }),
  details: z.string().min(1, { message: 'Please provide account details.' }),
});

type WithdrawalFormValues = z.infer<typeof withdrawalFormSchema>;

export default function WithdrawPage() {
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalFormSchema),
    defaultValues: {
      amount: 100,
      method: '',
      details: '',
    },
  });

  async function onSubmit(values: WithdrawalFormValues) {
    if (!user) {
      // This should ideally be handled more gracefully, e.g., showing a toast
      console.error("No user logged in");
      return;
    }
    setIsLoading(true);
    setWithdrawalSuccess(false);

    try {
      const withdrawalsCol = collection(firestore, `users/${user.uid}/withdrawals`);
      
      await addDocumentNonBlocking(withdrawalsCol, {
        userId: user.uid,
        amount: values.amount,
        method: values.method,
        details: values.details,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setWithdrawalSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      // Here you could show an error toast to the user
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className="animate-fade-in-up">
      <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Withdraw Funds
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Request a withdrawal of your earnings. Minimum withdrawal is GHS 100.
      </p>

      <div className="mt-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Request</CardTitle>
            <CardDescription>Funds will be sent to your selected account.</CardDescription>
          </CardHeader>
          <CardContent>
            {withdrawalSuccess ? (
               <Alert className="border-green-500 text-green-700">
                  <CheckCircle className="h-4 w-4 !text-green-500" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Your withdrawal request has been submitted. It will be processed shortly.
                  </AlertDescription>
              </Alert>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount to Withdraw (GHS)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="e.g., 250" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payout Account Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="momo">Mobile Money</SelectItem>
                            <SelectItem value="bank">Bank Account</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Details</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your number or bank account details" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Request Withdrawal
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
