
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
  ArrowLeftRight,
} from "lucide-react";
import { Cedi } from "@/components/cedi-icon";
import { Badge } from "@/components/ui/badge";
import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, differenceInDays, addMonths, parseISO } from 'date-fns';
import { Progress } from "@/components/ui/progress";

const recentReferrals = [
    { name: 'Kofi Mensah', level: 1, earnings: 'GHS 50.00', status: 'Active', date: '2 days ago' },
    { name: 'Ama Serwaa', level: 2, earnings: 'GHS 15.50', status: 'Active', date: '1 day ago' },
    { name: 'Esi Nana', level: 1, earnings: 'GHS 75.00', status: 'Active', date: '5 hours ago' },
    { name: 'Kwame Addo', level: 3, earnings: 'GHS 5.00', status: 'Pending', date: '3 days ago' },
];

const investments = [
  { id: 'INV-001', car: 'Standard SUV (SUV-01)', amount: 5000, roi: 12, startDate: '2023-11-01', duration: 12, status: 'Active' },
  { id: 'INV-002', car: 'Economy Sedan (SEDAN-01)', amount: 2000, roi: 9.5, startDate: '2024-02-15', duration: 6, status: 'Active' },
  { id: 'INV-003', car: 'Luxury Sportscar (LUX-01)', amount: 10000, roi: 15, startDate: '2023-08-20', duration: 12, status: 'Matured' },
];

const profitData = [
  { date: 'Jan', profit: 120 },
  { date: 'Feb', profit: 150 },
  { date: 'Mar', profit: 140 },
  { date: 'Apr', profit: 180 },
  { date: 'May', profit: 210 },
  { date: 'Jun', profit: 200 },
];

const recentTransactions = [
    { id: 'TXN-001', type: 'Deposit', amount: 'GHS 500.00', status: 'Completed', date: '3 days ago' },
    { id: 'TXN-002', type: 'Investment', amount: 'GHS 2000.00', status: 'Completed', date: '2 days ago' },
    { id: 'TXN-003', type: 'Withdrawal', amount: 'GHS 150.00', status: 'Pending', date: '1 day ago' },
    { id: 'TXN-004', type: 'Profit', amount: 'GHS 12.50', status: 'Completed', date: '5 hours ago' },
];


export default function DashboardPage() {
  const { user } = useUser();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{balance: number, totalEarned: number}>(userProfileRef);

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
  }

  const statsCards = [
    {
      title: "Total Balance",
      amount: formatCurrency(userProfile?.balance),
      icon: Wallet,
    },
    {
      title: "Total Investments",
      amount: "GHS 50,000.00", // This would also come from user data
      icon: Cedi,
    },
    {
      title: "Total Profit",
      amount: formatCurrency(userProfile?.totalEarned),
      icon: TrendingUp,
    },
    {
      title: "Referral Earnings",
      amount: "GHS 500.00", // This would also come from user data
      icon: Users,
    },
  ];

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
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `GHS ${value}`} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
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
                    <TableHead>Amount (GHS)</TableHead>
                    <TableHead>Monthly ROI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[300px]">Maturity Progress</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {investments.map((inv) => {
                    const startDate = parseISO(inv.startDate);
                    const endDate = addMonths(startDate, inv.duration);
                    const totalDays = differenceInDays(endDate, startDate);
                    const elapsedDays = differenceInDays(new Date(), startDate);
                    const progress = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

                    return (
                        <TableRow key={inv.id}>
                        <TableCell className="font-medium">{inv.car}</TableCell>
                        <TableCell>{inv.amount.toFixed(2)}</TableCell>
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
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentTransactions.map((txn, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">{txn.type}</TableCell>
                            <TableCell>{txn.amount}</TableCell>
                            <TableCell>
                            <Badge variant={txn.status === 'Completed' ? 'default' : 'secondary'}>
                                {txn.status}
                            </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{txn.date}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </CardContent>
            </Card>
       </div>

    </div>
  );
}
