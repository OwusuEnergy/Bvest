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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePaystackPayment } from 'react-paystack';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle, Loader2 } from 'lucide-react';
import type { User } from 'firebase/auth';
import { useFirestore } from '@/firebase';
import { doc, writeBatch, collection, serverTimestamp, increment, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';


const depositFormSchema = z.object({
    amount: z.coerce.number().min(10, { message: 'Minimum deposit is GHS 10.' }),
});

type DepositFormValues = z.infer<typeof depositFormSchema>;

export function DepositDialog({ children, user }: { children: React.ReactNode, user: User | null }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<DepositFormValues>({
        resolver: zodResolver(depositFormSchema),
        defaultValues: {
            amount: 100,
        },
    });

    const amountInPesewas = form.watch('amount') * 100;

    const config = {
        reference: new Date().getTime().toString(),
        email: user?.email || '',
        amount: amountInPesewas, 
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_a0a552f865893108c487858c2b535b914441097a',
        currency: 'GHS',
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = async (reference: any) => {
        setIsLoading(true);
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'User or database not available.' });
            setIsLoading(false);
            return;
        }

        const depositAmount = config.amount / 100;
        const batch = writeBatch(firestore);
        const userDocRef = doc(firestore, 'users', user.uid);
        
        try {
            const userDoc = await getDoc(userDocRef);
            if (!userDoc.exists()) {
                throw new Error("User document not found.");
            }
            const currentBalance = userDoc.data().balance || 0;
            const newBalance = currentBalance + depositAmount;

            // 1. Update user balance
            batch.update(userDocRef, {
                balance: increment(depositAmount),
            });

            // 2. Create a transaction record
            const transactionRef = doc(collection(firestore, `users/${user.uid}/transactions`));
            batch.set(transactionRef, {
                userId: user.uid,
                type: 'Deposit',
                amount: depositAmount,
                balanceAfter: newBalance,
                description: `Deposit via Paystack. Ref: ${reference.reference}`,
                createdAt: serverTimestamp(),
            });

            await batch.commit();
            
            setPaymentSuccess(true);
            form.reset();
            setTimeout(() => {
                setOpen(false);
                setPaymentSuccess(false);
            }, 3000);

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Deposit Failed',
                description: 'Failed to update your balance. Please contact support.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const onClose = () => {
        console.log('Payment dialog closed');
    };

    function onSubmit(values: DepositFormValues) {
        initializePayment({onSuccess, onClose});
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
                        <CheckCircle className="h-4 w-4 !text-green-500" />
                        <AlertTitle>Success!</AlertTitle>
                        <AlertDescription>
                            Your deposit was successful. Your balance has been updated.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount (GHS)</FormLabel>
                                    <FormControl>
                                    <Input type="number" placeholder="e.g., 100" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Proceed to Paystack
                            </Button>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
