
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/admin/page-header';
import { AddCarDialog } from '@/components/admin/add-car-dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Car } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { CarActions } from '@/components/admin/car-actions';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

type SortKey = 'name' | 'totalValue' | 'investedAmount';
type SortDirection = 'asc' | 'desc';

export default function AdminCarsPage() {
  const firestore = useFirestore();
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection }>({ key: 'name', direction: 'asc' });

  const carsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'cars'), orderBy(sortConfig.key, sortConfig.direction));
  }, [firestore, sortConfig]);

  const { data: cars, isLoading } = useCollection<Car>(carsQuery);

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
  }

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const SortableHeader = ({ sortKey, children }: { sortKey: SortKey, children: React.ReactNode }) => (
    <TableHead>
      <Button variant="ghost" onClick={() => handleSort(sortKey)}>
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

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
                <SortableHeader sortKey="name">Name</SortableHeader>
                <SortableHeader sortKey="totalValue">Total Value</SortableHeader>
                <SortableHeader sortKey="investedAmount">Invested</SortableHeader>
                <TableHead>ROI</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
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
                    <TableCell><Skeleton className="h-8 w-20 float-right" /></TableCell>
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
                  <TableCell className="text-right">
                    <CarActions car={car} />
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
