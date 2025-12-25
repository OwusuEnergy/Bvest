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
import { CheckCircle } from 'lucide-react';


const depositFormSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    amount: z.coerce.number().min(10, { message: 'Minimum deposit is GHS 10.' }),
});

type DepositFormValues = z.infer<typeof depositFormSchema>;

export function DepositDialog({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const form = useForm<DepositFormValues>({
        resolver: zodResolver(depositFormSchema),
        defaultValues: {
            email: 'user@email.com',
            amount: 100,
        },
    });

    const config = {
        reference: new Date().getTime().toString(),
        email: form.watch('email'),
        amount: form.watch('amount') * 100, // Amount in pesewas
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '', // Use environment variable
        currency: 'GHS',
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = (reference: any) => {
        console.log('Payment successful:', reference);
        setPaymentSuccess(true);
        form.reset();
        setTimeout(() => {
            setOpen(false);
            setPaymentSuccess(false);
        }, 3000);
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
                            Your payment was successful. Your balance will be updated shortly.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                    <Input type="email" placeholder="you@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
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
                                Proceed to Paystack
                            </Button>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
