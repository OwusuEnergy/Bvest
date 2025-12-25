
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc, writeBatch, increment, getDoc, query, where, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { authLinks } from '@/lib/constants';
import type { Car } from '@/lib/types';
import { cn } from '@/lib/utils';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const investmentPlans = [
  { name: 'Silver', amount: 100, description: 'A great starting point', colorClass: 'border-slate-300' },
  { name: 'Bronze', amount: 300, description: 'A popular choice for steady growth', colorClass: 'border-orange-400' },
  { name: 'Gold', amount: 500, description: 'Maximize your potential returns', colorClass: 'border-amber-400' },
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

  const { data: userProfile } = useDoc<{balance: number, referredById?: string, totalInvested?: number}>(userProfileRef);

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
      const batch = writeBatch(firestore);
      const userDocRef = doc(firestore, 'users', user.uid);

      // 1. Handle main investment transaction
      const newBalance = userProfile.balance - selectedPlan.amount;
      batch.update(userDocRef, { 
        balance: newBalance,
        totalInvested: increment(selectedPlan.amount)
      });
      
      const investmentsColRef = collection(firestore, `users/${user.uid}/investments`);
      const newInvestmentRef = doc(investmentsColRef);
      batch.set(newInvestmentRef, {
        userId: user.uid,
        carId: car.id,
        carName: car.name,
        amount: selectedPlan.amount,
        duration: 12,
        roi: car.roi,
        startDate: serverTimestamp(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: 'Active',
        dailyProfit: 0,
        totalProfit: 0,
        createdAt: serverTimestamp(),
      });
      
      const transactionsColRef = collection(firestore, `users/${user.uid}/transactions`);
      batch.set(doc(transactionsColRef), {
        userId: user.uid,
        type: 'Investment',
        amount: selectedPlan.amount,
        balanceAfter: newBalance,
        description: `Investment in ${car.name}`,
        createdAt: serverTimestamp(),
      });

      // 2. Handle referral commission
      const isFirstInvestment = (userProfile.totalInvested || 0) === 0;
      if (userProfile.referredById && isFirstInvestment) {
        const commissionAmount = selectedPlan.amount * 0.30;
        const referrerRef = doc(firestore, 'users', userProfile.referredById);
        const referrerDoc = await getDoc(referrerRef);

        if (referrerDoc.exists()) {
          const referrerData = referrerDoc.data();
          const referrerNewBalance = (referrerData.balance || 0) + commissionAmount;
          
          batch.update(referrerRef, {
            balance: increment(commissionAmount),
            totalEarned: increment(commissionAmount),
            referralEarnings: increment(commissionAmount),
          });

          // Create transaction for referrer
          const referrerTransactionsRef = collection(firestore, `users/${userProfile.referredById}/transactions`);
          batch.set(doc(referrerTransactionsRef), {
            userId: userProfile.referredById,
            type: 'Referral Bonus',
            amount: commissionAmount,
            balanceAfter: referrerNewBalance,
            description: `30% commission from ${userProfile.name || user.displayName}'s first investment.`,
            createdAt: serverTimestamp(),
          });

          // Update the referral document
          const referralQuery = query(
            collection(firestore, `users/${userProfile.referredById}/referrals`),
            where('referredId', '==', user.uid)
          );
          const referralSnapshot = await getDocs(referralQuery);
          if (!referralSnapshot.empty) {
            const referralDocRef = referralSnapshot.docs[0].ref;
            batch.update(referralDocRef, {
              earned: increment(commissionAmount)
            });
          }
        }
      }

      await batch.commit();

      setIsSuccess(true);
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

  const investmentProgress = (car.investedAmount / car.totalValue) * 100;
  const isButtonDisabled = investmentProgress >= 100;


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
                    selectedPlan?.name === plan.name ? `ring-2 ring-primary ring-offset-2 ring-offset-background ${plan.colorClass}` : 'border-transparent'
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
