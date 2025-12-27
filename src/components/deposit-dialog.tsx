
'use client';

import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePaystackPayment } from 'react-paystack';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import type { User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import type { PaystackProps } from 'react-paystack/dist/types';
import { doc, writeBatch, collection, getFirestore, increment, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

const depositFormSchema = z.object({
  amount: z.coerce.number().min(10, { message: 'Minimum deposit is GHS 10.' }),
});

type DepositFormValues = z.infer<typeof depositFormSchema>;

const depositPlans = [
  { name: 'Silver', amount: 100 },
  { name: 'Bronze', amount: 300 },
  { name: 'Gold', amount: 500 },
];

export function DepositDialog({ children, user }: { children: React.ReactNode, user: User | null }) {
  const [open, setOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [config, setConfig] = useState<PaystackProps | null>(null);
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
      amount: '' as any,
    },
  });

  const initializePayment = usePaystackPayment(config as PaystackProps);

  const onSuccess = async (reference: { reference: string }) => {
    toast({
        title: 'Payment Processing...',
        description: 'Your payment is being processed and your balance will be updated shortly.'
    });

    // Optimistic update for instant UI feedback
    if (user && config && firestore) {
        const amountDeposited = config.amount / 100;
        const userRef = doc(firestore, 'users', user.uid);
        const transactionRef = doc(collection(firestore, `users/${user.uid}/transactions`), reference.reference);

        try {
            const batch = writeBatch(firestore);
            
            // Get current user data to calculate new balance for transaction log
            const userDoc = await getDoc(userRef);
            const currentBalance = userDoc.data()?.balance || 0;
            const newBalance = currentBalance + amountDeposited;

            batch.update(userRef, { balance: increment(amountDeposited) });

            batch.set(transactionRef, {
                id: reference.reference,
                userId: user.uid,
                type: 'Deposit',
                amount: amountDeposited,
                balanceAfter: newBalance,
                description: `Deposit via Paystack. Ref: ${reference.reference}`,
                createdAt: new Date(),
                status: 'pending' // Status is pending until webhook confirms
            });
            await batch.commit();
        } catch (error) {
            console.error("Optimistic update failed:", error);
            // Don't worry, the webhook will still handle it as the source of truth.
        }
    }

    setPaymentSuccess(true);
    form.reset();
    setTimeout(() => {
        setOpen(false);
        setPaymentSuccess(false);
    }, 4000);
  };

  const onClose = () => {
    // This is called when the user closes the payment dialog
  };

  function onSubmit(values: DepositFormValues) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to deposit.' });
      return;
    }

    const amountInPesewas = values.amount * 100;

    const newConfig: PaystackProps = {
      reference: new Date().getTime().toString(),
      email: user.email || '',
      amount: amountInPesewas,
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      currency: 'GHS',
      metadata: {
        user_id: user.uid, // Pass user ID to webhook
      }
    };

    setConfig(newConfig);
  }

  useEffect(() => {
    if (config) {
      initializePayment({ onSuccess, onClose });
    }
  }, [config, initializePayment]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
          <DialogDescription>
            Add funds to your BVest account using Paystack.
          </DialogDescription>
        </DialogHeader>
        {paymentSuccess ? (
          <Alert className="border-green-500 text-green-700">
            <CheckCircle className="h-4 w-4 !text-green-500" />
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Your payment was successful and your balance has been updated.
            </AlertDescription>
          </Alert>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="space-y-2">
                <FormLabel>Select an amount</FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  {depositPlans.map((plan) => (
                    <Button
                      key={plan.name}
                      type="button"
                      variant={form.watch('amount') === plan.amount ? 'default' : 'outline'}
                      onClick={() => form.setValue('amount', plan.amount, { shouldValidate: true })}
                    >
                      {plan.amount} GHS
                    </Button>
                  ))}
                </div>
              </div>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Or enter custom amount (GHS)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 50.50"
                        {...field}
                         onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Proceed to Deposit
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
