
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
import { useToast } from '@/hooks/use-toast';


const depositFormSchema = z.object({
    amount: z.coerce.number().min(10, { message: 'Minimum deposit is GHS 10.' }),
});

type DepositFormValues = z.infer<typeof depositFormSchema>;

export function DepositDialog({ children, user }: { children: React.ReactNode, user: User | null }) {
    const [open, setOpen] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
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
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_ba8de7a354869df9b9a0e19155d78422e557afe5',
        currency: 'GHS',
        metadata: {
          user_id: user?.uid, // Pass user ID to webhook
        }
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = (reference: { reference: string }) => {
        // The webhook will handle the database update.
        // We just show a success message to the user.
        setPaymentSuccess(true);
        form.reset();
        setTimeout(() => {
            setOpen(false);
            setPaymentSuccess(false);
        }, 4000);
    };

    const onClose = () => {
        console.log('Payment dialog closed');
    };

    function onSubmit(values: DepositFormValues) {
        if (!user) {
            toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to deposit.' });
            return;
        }
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
                        <AlertTitle>Processing!</AlertTitle>
                        <AlertDescription>
                            Your payment is being processed. Your balance will be updated shortly.
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
