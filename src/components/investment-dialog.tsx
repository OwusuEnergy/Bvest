
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { authLinks } from '@/lib/constants';
import type { Car } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const investmentPlans = [
  { name: 'Silver', amount: 100, description: 'A great starting point', colorClass: 'border-slate-300 dark:border-slate-600 from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 bg-gradient-to-br' },
  { name: 'Bronze', amount: 300, description: 'A popular choice for steady growth', colorClass: 'border-amber-600 dark:border-amber-500 from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-900/70 bg-gradient-to-br' },
  { name: 'Gold', amount: 500, description: 'Maximize your potential returns', colorClass: 'border-yellow-500 dark:border-yellow-400 from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-900/70 bg-gradient-to-br' },
];

export function InvestmentDialog({ car }: { car: Car }) {
  const [open, setOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<(typeof investmentPlans)[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{balance: number}>(userProfileRef);

  const handleInvest = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You need to be logged in to invest.',
      });
      router.push(authLinks.login);
      return;
    }
    if (!selectedPlan) {
      toast({
        variant: 'destructive',
        title: 'No Plan Selected',
        description: 'Please select an investment plan.',
      });
      return;
    }
    if (!userProfile || (userProfile.balance < selectedPlan.amount)) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Funds',
        description: 'You do not have enough balance to make this investment. Please deposit funds first.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Deduct from balance
      const newBalance = userProfile.balance - selectedPlan.amount;
      const userDocRef = doc(firestore, 'users', user.uid);
      await updateDoc(userDocRef, { balance: newBalance });
      
      // 2. Create investment record
      const investmentsCol = collection(firestore, `users/${user.uid}/investments`);
      await addDoc(investmentsCol, {
        userId: user.uid,
        carId: car.id,
        amount: selectedPlan.amount,
        duration: 12, // Default duration, can be customized
        roi: car.roi,
        startDate: serverTimestamp(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 year from now
        status: 'Active',
        dailyProfit: 0, // Should be calculated by a backend process
        totalProfit: 0,
        createdAt: serverTimestamp(),
      });

      setIsSuccess(true);
      // Reset after a delay
       setTimeout(() => {
        setOpen(false);
        setIsSuccess(false);
        setSelectedPlan(null);
      }, 3000);

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Investment Failed',
        description: error.message || 'There was an issue processing your investment.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isButtonDisabled = car.slots === 0;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
        setIsSuccess(false);
        setSelectedPlan(null);
      }
    }}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={isButtonDisabled}>
          {isButtonDisabled ? 'Fully Funded' : 'Invest Now'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invest in {car.name}</DialogTitle>
          <DialogDescription>
            Choose an investment plan to get started. Your returns will be calculated based on the {car.roi}% ROI.
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
             <Alert className="border-green-500 text-green-700">
                <CheckCircle className="h-4 w-4 !text-green-500" />
                <AlertTitle>Investment Successful!</AlertTitle>
                <AlertDescription>
                  Congratulations! Your investment in {car.name} is now active.
                </AlertDescription>
            </Alert>
        ) : (
            <div className="space-y-4 py-4">
            {investmentPlans.map((plan) => (
                <Card
                key={plan.name}
                onClick={() => setSelectedPlan(plan)}
                className={cn(
                    'cursor-pointer transition-all hover:scale-105 border-2',
                    plan.colorClass,
                    selectedPlan?.name === plan.name ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-transparent'
                )}
                >
                <CardContent className="p-4 flex justify-between items-center">
                    <div>
                    <h4 className="font-semibold">{plan.name} Plan</h4>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <p className="text-lg font-bold">GH₵ {plan.amount}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        )}

        {!isSuccess && (
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleInvest} disabled={!selectedPlan || isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Processing...' : `Invest GH₵ ${selectedPlan?.amount || ''}`}
                </Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
