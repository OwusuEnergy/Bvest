
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
import { Cedi } from "@/components/cedi-icon";
import { Badge } from "@/components/ui/badge";
import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { doc } from "firebase/firestore";

const recentReferrals = [
    { name: 'Kofi Mensah', level: 1, earnings: 'GHS 50.00', status: 'Active', date: '2 days ago' },
    { name: 'Ama Serwaa', level: 2, earnings: 'GHS 15.50', status: 'Active', date: '1 day ago' },
    { name: 'Esi Nana', level: 1, earnings: 'GHS 75.00', status: 'Active', date: '5 hours ago' },
    { name: 'Kwame Addo', level: 3, earnings: 'GHS 5.00', status: 'Pending', date: '3 days ago' },
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
    <div className="flex flex-col gap-6 animate-fade-in-up">
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
      <div className="grid grid-cols-1 gap-6">
        <Card className="animate-fade-in-up" style={{animationDelay: '400ms'}}>
          <CardHeader>
            <CardTitle className="font-headline">Total Referrals</CardTitle>
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
                  <TableHead>Status</TableHead>
                  <TableHead>Date Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReferrals.map((ref, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{ref.name}</TableCell>
                    <TableCell>Level {ref.level}</TableCell>
                    <TableCell>{ref.earnings}</TableCell>
                    <TableCell>
                      <Badge variant={ref.status === 'Active' ? 'default' : 'secondary'}>
                        {ref.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{ref.date}</TableCell>
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
