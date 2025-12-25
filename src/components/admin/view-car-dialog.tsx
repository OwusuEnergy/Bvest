
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Car } from '@/lib/types';
import Image from 'next/image';
import { Badge } from '../ui/badge';

interface ViewCarDialogProps {
  car: Car;
  children: React.ReactNode;
}

export function ViewCarDialog({ car, children }: ViewCarDialogProps) {
  const [open, setOpen] = useState(false);

    const formatCurrency = (amount: number = 0) => {
        return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
    }
    
  const investmentProgress = car.totalValue > 0 ? (car.investedAmount / car.totalValue) * 100 : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{car.name}</DialogTitle>
          <DialogDescription>
            Detailed view of the car available for investment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="relative h-48 w-full rounded-md border">
                <Image src={car.image} alt={car.name} fill className="object-cover rounded-md" />
            </div>
            <p className='text-sm text-muted-foreground'>{car.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="font-medium text-muted-foreground">Total Value</p>
                    <p className="font-semibold">{formatCurrency(car.totalValue)}</p>
                </div>
                 <div>
                    <p className="font-medium text-muted-foreground">Invested Amount</p>
                    <p className="font-semibold">{formatCurrency(car.investedAmount)}</p>
                </div>
                 <div>
                    <p className="font-medium text-muted-foreground">Monthly ROI</p>
                    <p className="font-semibold">{car.roi}%</p>
                </div>
                 <div>
                    <p className="font-medium text-muted-foreground">Status</p>
                    <p><Badge variant={car.status === 'available' ? 'default' : 'secondary'}>{car.status}</Badge></p>
                </div>
            </div>
            <div>
                 <p className="text-sm font-medium text-muted-foreground">Investment Progress</p>
                 <div className="w-full bg-muted rounded-full h-2 my-1">
                    <div className="bg-primary h-2 rounded-full" style={{width: `${investmentProgress}%`}}></div>
                </div>
                <p className='text-xs text-muted-foreground'>{investmentProgress.toFixed(0)}% funded</p>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
