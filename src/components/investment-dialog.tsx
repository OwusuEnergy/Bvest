
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { authLinks } from '@/lib/constants';
import type { Car } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const investmentPlans = [
  { name: 'Silver', amount: 100, description: 'A great starting point' },
  { name: 'Bronze', amount: 300, description: 'A popular choice for steady growth' },
  { name: 'Gold', amount: 500, description: 'Maximize your potential returns' },
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

    setIsLoading(true);

    try {
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
    <Dialog open={open} onOpenChange={setOpen}>
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
                    'cursor-pointer transition-all hover:bg-muted/50',
                    selectedPlan?.name === plan.name && 'ring-2 ring-primary'
                )}
                >
                <CardContent className="p-4 flex justify-between items-center">
                    <div>
                    <h4 className="font-semibold">{plan.name} Plan</h4>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <p className="text-lg font-bold">GHS {plan.amount}</p>
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
                    {isLoading ? 'Processing...' : `Invest GHS ${selectedPlan?.amount || ''}`}
                </Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
