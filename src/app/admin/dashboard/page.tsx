
'use client';

import { PageHeader } from '@/components/admin/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Car, Users, Wallet } from 'lucide-react';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  const carsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'cars'));
  }, [firestore]);
  const { data: cars, isLoading: carsLoading } = useCollection(carsQuery);

  const usersQuery = useMemoFirebase(() => {
     if (!firestore) return null;
    return query(collection(firestore, 'users'));
  }, [firestore]);
  const { data: users, isLoading: usersLoading } = useCollection<User>(usersQuery);

  const totalInvested = users?.reduce((sum, user) => sum + (user.totalInvested || 0), 0) || 0;

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
  }
  
  const isLoading = carsLoading || usersLoading;

  return (
    <div>
      <PageHeader title="Admin Dashboard" description="An overview of your platform's activity." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold font-headline">{users?.length ?? 0}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold font-headline">{cars?.length ?? 0}</div>}
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Platform Investment</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-32" /> : <div className="text-2xl font-bold font-headline">{formatCurrency(totalInvested)}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
