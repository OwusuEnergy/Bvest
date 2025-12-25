
'use client';

import { PageHeader } from '@/components/admin/page-header';
import { AddCarDialog } from '@/components/admin/add-car-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Car } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function AdminCarsPage() {
  const firestore = useFirestore();

  const carsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'cars'));
  }, [firestore]);

  const { data: cars, isLoading } = useCollection<Car>(carsQuery);

   const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Manage Cars" description="View, add, or edit cars available for investment." />
        <AddCarDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Invested Amount</TableHead>
                <TableHead>ROI</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-16 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                </TableRow>
              ))}
              {cars?.map((car) => (
                <TableRow key={car.id}>
                  <TableCell>
                    <div className="relative h-10 w-16 rounded-md">
                        {car.image && (
                            <Image
                                src={car.image}
                                alt={car.name}
                                fill
                                className="object-cover rounded-md"
                            />
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{car.name}</TableCell>
                  <TableCell>{formatCurrency(car.totalValue)}</TableCell>
                  <TableCell>{formatCurrency(car.investedAmount)}</TableCell>
                  <TableCell>{car.roi}%</TableCell>
                  <TableCell>
                    <Badge variant={car.status === 'available' ? 'default' : 'secondary'}>{car.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
