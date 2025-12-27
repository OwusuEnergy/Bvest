
'use client';

import React, { useState } from 'react';
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
import { CheckCircle, PartyPopper } from 'lucide-react';
import type { User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import type { PaystackProps } from 'react-paystack/dist/types';
import { doc, writeBatch, collection, increment } from 'firebase/firestore';
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
  const { toast } = useToast();
  const firestore = useFirestore();

  const form = useForm<DepositFormValues>({
    resolver: zodResolver(depositFormSchema),
    defaultValues: {
        amount: undefined,
    },
  });

  const onSuccess = (reference: { reference: string }) => {
    toast({
        title: (
            <div className="flex items-center gap-2">
                <PartyPopper className="h-5 w-5 text-green-500" />
                <span className="font-bold text-green-600">Payment Complete</span>
            </div>
        ),
        description: 'Congratulations! Your deposit was successful and has been added to your balance.',
    });

    if (user && firestore) {
        const amountDeposited = form.getValues('amount');
        const userRef = doc(firestore, 'users', user.uid);
        
        const batch = writeBatch(firestore);
        
        batch.update(userRef, { balance: increment(amountDeposited) });
        
        const transactionRef = doc(collection(firestore, `users/${user.uid}/transactions`), reference.reference);
        batch.set(transactionRef, {
            id: reference.reference,
            userId: user.uid,
            type: 'Deposit',
            amount: amountDeposited,
            description: `Deposit via Paystack. Ref: ${reference.reference}`,
            createdAt: new Date(),
            status: 'pending' 
        });
        
        batch.commit().catch(error => {
            console.error("Optimistic update failed:", error);
        });
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

  const initializePayment = usePaystackPayment();

  function onSubmit(values: DepositFormValues) {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to deposit.' });
      return;
    }
    const config: PaystackProps = {
      reference: new Date().getTime().toString(),
      email: user.email!,
      amount: values.amount * 100, // Amount in pesewas/kobo
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      currency: 'GHS',
      metadata: {
        user_id: user.uid,
      },
    };
    initializePayment({ onSuccess, onClose, config });
  }

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
            <PartyPopper className="h-4 w-4 !text-green-500" />
            <AlertTitle>Congratulations!</AlertTitle>
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
