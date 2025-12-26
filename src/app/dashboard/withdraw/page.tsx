
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const withdrawalFormSchema = (maxAmount: number) => z.object({
  amount: z.coerce
    .number()
    .min(100, { message: 'Minimum withdrawal is GHS 100.' })
    .max(maxAmount, { message: `You can only withdraw up to your total profit of GHS ${maxAmount.toFixed(2)}.` }),
  details: z.string().min(10, { message: 'Please provide a valid mobile money number.' }),
});

export default function WithdrawPage() {
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{ totalEarned: number }>(userProfileRef);
  const availableProfit = userProfile?.totalEarned || 0;
  
  const formSchema = withdrawalFormSchema(availableProfit);
  type WithdrawalFormValues = z.infer<typeof formSchema>;

  const form = useForm<WithdrawalFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 100,
      details: '',
    },
  });

  async function onSubmit(values: WithdrawalFormValues) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'No user logged in' });
      return;
    }
    if (availableProfit < 100) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Profit',
        description: 'You need at least GHS 100 in total profit to make a withdrawal.',
      });
      return;
    }
    setIsLoading(true);
    setWithdrawalSuccess(false);

    try {
      const withdrawalsCol = collection(firestore, `users/${user.uid}/withdrawals`);
      
      await addDoc(withdrawalsCol, {
        userId: user.uid,
        amount: values.amount,
        method: 'momo',
        details: values.details,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setWithdrawalSuccess(true);
      form.reset();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Error submitting withdrawal request.',
      });
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
        Request a withdrawal of your earnings. You can only withdraw your available profit (minimum GHS 100).
      </p>

      <div className="mt-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Request</CardTitle>
            <CardDescription>
              Your available profit to withdraw is GHS {availableProfit.toFixed(2)}. Funds will be sent to your Mobile Money account.
            </CardDescription>
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
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mobile Money Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your mobile money number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading || availableProfit < 100}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {availableProfit < 100 ? 'Insufficient Profit' : 'Request Withdrawal'}
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
