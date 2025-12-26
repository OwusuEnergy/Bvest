
'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/admin/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFirestore } from '@/firebase';
import { collectionGroup, query, where, getDocs, doc, writeBatch, getDoc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type Withdrawal = {
  id: string;
  userId: string;
  amount: number;
  details: string;
  status: 'pending' | 'processed' | 'rejected';
  createdAt: any;
  userName?: string;
};

export default function AdminWithdrawalsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchWithdrawals = useMemo(() => async () => {
    if (!firestore) return;
    setIsLoading(true);
    try {
      const withdrawalsQuery = query(collectionGroup(firestore, 'withdrawals'), where('status', '==', 'pending'));
      const snapshot = await getDocs(withdrawalsQuery);
      
      const withdrawalsData = await Promise.all(snapshot.docs.map(async (withdrawalDoc) => {
        const data = withdrawalDoc.data();
        const userDocRef = doc(firestore, 'users', data.userId);
        const userDoc = await getDoc(userDocRef);
        const userName = userDoc.exists() ? userDoc.data().name : 'Unknown User';

        return {
          id: withdrawalDoc.id,
          userId: data.userId,
          amount: data.amount,
          details: data.details,
          status: data.status,
          createdAt: data.createdAt.toDate(),
          userName,
        } as Withdrawal;
      }));

      setWithdrawals(withdrawalsData);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch withdrawal requests.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [firestore, toast]);
  
  useEffect(() => {
    if (firestore && isClient) {
      fetchWithdrawals();
    }
  }, [firestore, isClient, fetchWithdrawals]);


  const handleRequest = async (withdrawal: Withdrawal, newStatus: 'processed' | 'rejected') => {
    if (!firestore) return;

    setProcessingId(withdrawal.id);
    const batch = writeBatch(firestore);

    const userDocRef = doc(firestore, 'users', withdrawal.userId);
    const withdrawalDocRef = doc(firestore, `users/${withdrawal.userId}/withdrawals`, withdrawal.id);

    try {
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error('User not found.');
      }
      const userData = userDoc.data();

      if (newStatus === 'processed') {
        if (userData.balance < withdrawal.amount) {
          throw new Error('Insufficient user balance.');
        }
        const newBalance = userData.balance - withdrawal.amount;
        batch.update(userDocRef, { balance: newBalance });

        // Add a transaction record for the withdrawal
        const transactionRef = doc(collection(firestore, `users/${withdrawal.userId}/transactions`));
        batch.set(transactionRef, {
            userId: withdrawal.userId,
            type: 'Withdrawal',
            amount: withdrawal.amount,
            balanceAfter: newBalance,
            description: `Withdrawal to ${withdrawal.details}`,
            createdAt: new Date(),
        });
      }
      
      batch.update(withdrawalDocRef, { status: newStatus, processedAt: new Date() });

      await batch.commit();

      toast({
        title: 'Success',
        description: `Withdrawal has been ${newStatus}.`,
      });
      // Refresh the list
      fetchWithdrawals();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Operation Failed',
        description: error.message,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    return format(date, 'MMM dd, yyyy - hh:mm a');
  };

  return (
    <div>
      <PageHeader title="Withdrawal Requests" description="Approve or reject user withdrawal requests." />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Mobile Money Number</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-32 float-right" /></TableCell>
                </TableRow>
              ))}
              {!isLoading && withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-medium">{withdrawal.userName}</TableCell>
                  <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                  <TableCell>{withdrawal.details}</TableCell>
                  <TableCell>{formatDate(withdrawal.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={withdrawal.status === 'pending' ? 'secondary' : 'default'}>{withdrawal.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {withdrawal.status === 'pending' && (
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRequest(withdrawal, 'rejected')}
                          disabled={processingId === withdrawal.id}
                        >
                          {processingId === withdrawal.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRequest(withdrawal, 'processed')}
                          disabled={processingId === withdrawal.id}
                        >
                          {processingId === withdrawal.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Approve
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && withdrawals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">No pending withdrawal requests.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
