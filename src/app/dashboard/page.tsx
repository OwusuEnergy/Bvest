
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { collection, doc, query, orderBy, Timestamp, limit } from "firebase/firestore";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, differenceInDays, addMonths, parseISO, formatDistanceToNow } from 'date-fns';
import { Progress } from "@/components/ui/progress";

const recentReferrals = [
    { name: 'Kofi Mensah', level: 1, earnings: 'GH₵ 50.00', status: 'Active', date: '2 days ago' },
    { name: 'Ama Serwaa', level: 2, earnings: 'GH₵ 15.50', status: 'Active', date: '1 day ago' },
    { name: 'Esi Nana', level: 1, earnings: 'GH₵ 75.00', status: 'Active', date: '5 hours ago' },
    { name: 'Kwame Addo', level: 3, earnings: 'GH₵ 5.00', status: 'Pending', date: '3 days ago' },
];

const profitData = [
  { date: 'Jan', profit: 120 },
  { date: 'Feb', profit: 150 },
  { date: 'Mar', profit: 140 },
  { date: 'Apr', profit: 180 },
  { date: 'May', profit: 210 },
  { date: 'Jun', profit: 200 },
];

export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{balance: number, totalEarned: number}>(userProfileRef);

  const investmentsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, `users/${user.uid}/investments`), orderBy('createdAt', 'desc'));
  }, [firestore, user]);

  const { data: investments } = useCollection(investmentsQuery);

  const transactionsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, `users/${user.uid}/transactions`), orderBy('createdAt', 'desc'), limit(5));
  }, [firestore, user]);

  const { data: recentTransactions } = useCollection(transactionsQuery);

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', currencyDisplay: 'symbol' }).format(amount);
  }

  const totalInvestments = investments?.reduce((acc, inv) => acc + inv.amount, 0) || 0;

  const statsCards = [
    {
      title: "Total Balance",
      amount: formatCurrency(userProfile?.balance),
      icon: Wallet,
    },
    {
      title: "Total Investments",
      amount: formatCurrency(totalInvestments),
      icon: Wallet,
    },
    {
      title: "Total Profit",
      amount: formatCurrency(userProfile?.totalEarned),
      icon: TrendingUp,
    },
    {
      title: "Referral Earnings",
      amount: "GH₵ 500.00", // This would also come from user data
      icon: Users,
    },
  ];

  const formatDateFromTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return format(timestamp.toDate(), 'MMM dd, yyyy');
  }

  const formatDistanceToNowFromTimestamp = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
  }

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <Card key={card.title} className="animate-fade-in-up" style={{animationDelay: `${index * 100}ms`}}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-headline">{card.amount}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-8">
             <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Monthly Profit</CardTitle>
                  <CardDescription>Your profit earnings over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={profitData}>
                      <defs>
                        <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `GH₵ ${value}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        formatter={(value: number) => [formatCurrency(value), "Profit"]}
                      />
                      <Area type="monotone" dataKey="profit" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorProfit)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-8">
             <Card className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
                <CardHeader>
                    <CardTitle className="font-headline">Recent Referrals</CardTitle>
                    <CardDescription>
                    A quick look at your referral network.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Earnings</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentReferrals.slice(0, 4).map((ref, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">{ref.name}</TableCell>
                            <TableCell>Level {ref.level}</TableCell>
                            <TableCell>{ref.earnings}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      </div>
      
       <div className="grid grid-cols-1 gap-8">
         <Card>
            <CardHeader>
                <CardTitle className="font-headline">Investment Portfolio</CardTitle>
                <CardDescription>A list of all your investments, active and matured.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Car</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Monthly ROI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[300px]">Maturity Progress</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {investments && investments.map((inv) => {
                    const startDate = inv.startDate.toDate();
                    const endDate = inv.endDate.toDate();
                    const totalDays = differenceInDays(endDate, startDate);
                    const elapsedDays = differenceInDays(new Date(), startDate);
                    const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

                    return (
                        <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.carName || inv.carId}</TableCell>
                        <TableCell>{formatCurrency(inv.amount)}</TableCell>
                        <TableCell>{inv.roi}%</TableCell>
                        <TableCell>
                            <Badge variant={inv.status === 'Active' ? 'default' : 'secondary'}>{inv.status}</Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-4">
                            <Progress value={progress} className="h-2 w-[150px]" />
                            <span className="text-xs text-muted-foreground">
                                {inv.status === 'Matured' ? 'Completed' : `${Math.round(progress)}%`}
                            </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                            Ends {format(endDate, 'MMM dd, yyyy')}
                            </p>
                        </TableCell>
                        </TableRow>
                    );
                    })}
                     {(!investments || investments.length === 0) && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24">You have no investments yet.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </CardContent>
        </Card>
       </div>
       <div className="grid grid-cols-1 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Recent Transactions</CardTitle>
                    <CardDescription>
                    Your last few transactions on the platform.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentTransactions && recentTransactions.map((txn, i) => (
                        <TableRow key={txn.id}>
                            <TableCell>
                                <Badge variant={txn.type === 'Investment' ? 'secondary' : 'default'}>
                                    {txn.type}
                                </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{formatCurrency(txn.amount)}</TableCell>
                            <TableCell>{txn.description}</TableCell>
                            <TableCell className="text-muted-foreground">{formatDistanceToNowFromTimestamp(txn.createdAt)}</TableCell>
                        </TableRow>
                        ))}
                         {(!recentTransactions || recentTransactions.length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">You have no recent transactions.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
       </div>

    </div>
  );
}
