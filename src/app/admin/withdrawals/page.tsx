
'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFirestore } from '@/firebase';
import { collectionGroup, query, where, doc, writeBatch, getDoc, onSnapshot, Unsubscribe, collection, increment } from 'firebase/firestore';
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
        // This is where you would call the Paystack API to initiate the transfer.
        // For this example, we assume the transfer is successful if the admin clicks "Approve".
        // In a real app, you'd await a response from your payment gateway's API here.

        if (userData.balance < withdrawal.amount) {
          throw new Error('Insufficient user balance.');
        }
        if (userData.totalEarned < withdrawal.amount) {
            throw new Error('Withdrawal amount exceeds total profit.');
        }

        const newBalance = userData.balance - withdrawal.amount;
        batch.update(userDocRef, { 
            balance: newBalance,
            totalEarned: increment(-withdrawal.amount) 
        });

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

        batch.update(withdrawalDocRef, { status: newStatus, processedAt: new Date() });

      } else if (newStatus === 'rejected') {
        // If rejected, we don't change the balance, just the status
        batch.update(withdrawalDocRef, { status: newStatus, processedAt: new Date() });
      }
      
      await batch.commit();

      toast({
        title: 'Success',
        description: `Withdrawal has been ${newStatus}.`,
      });
      // Real-time listener will auto-update the list.
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
  
  useEffect(() => {
    if (!firestore || !isClient) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let unsubscribe: Unsubscribe | null = null;
    
    try {
      const withdrawalsQuery = query(collectionGroup(firestore, 'withdrawals'));
      
      unsubscribe = onSnapshot(withdrawalsQuery, async (snapshot) => {
        if (snapshot.empty) {
          setWithdrawals([]);
          setIsLoading(false);
          return;
        }

        let withdrawalsData: Omit<Withdrawal, 'userName'>[] = snapshot.docs.map(doc => ({
            id: doc.id,
            userId: doc.data().userId,
            ...doc.data()
        } as Omit<Withdrawal, 'userName'>));

        const userIds = [...new Set(withdrawalsData.map(w => w.userId))];
        const userPromises = userIds.map(uid => getDoc(doc(firestore, 'users', uid)));
        const userDocs = await Promise.all(userPromises);
        const userMap = new Map(userDocs.map(ud => [ud.id, ud.data()?.name || 'Unknown User']));

        const finalData = withdrawalsData.map(w => ({
          ...w,
          createdAt: w.createdAt?.toDate ? w.createdAt.toDate() : new Date(),
          userName: userMap.get(w.userId)
        })).sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        setWithdrawals(finalData);
        setIsLoading(false);

      }, (error) => {
        console.error("Error fetching withdrawals:", error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch withdrawal requests.',
        });
        setIsLoading(false);
      });
    
    } catch (error) {
       console.error("Error setting up snapshot:", error);
       setIsLoading(false);
    }

    return () => {
        if (unsubscribe) unsubscribe();
    };

  }, [firestore, isClient, toast]);


  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    return format(date, 'MMM dd, yyyy - hh:mm a');
  };
  
  const statusBadgeVariant = (status: Withdrawal['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'processed': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  }

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
                  <TableCell className="text-right"><Skeleton className="h-8 w-48 float-right" /></TableCell>
                </TableRow>
              ))}
              {!isLoading && withdrawals.map((withdrawal) => (
                <TableRow key={withdrawal.id}>
                  <TableCell className="font-medium">{withdrawal.userName}</TableCell>
                  <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                  <TableCell>{withdrawal.details}</TableCell>
                  <TableCell>{formatDate(withdrawal.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(withdrawal.status)}>{withdrawal.status}</Badge>
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
                  <TableCell colSpan={6} className="text-center h-24">No withdrawal requests found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
