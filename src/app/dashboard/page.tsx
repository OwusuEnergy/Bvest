"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  Users,
  TrendingUp,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const statsCards = [
  {
    title: "Total Balance",
    amount: "GHS 12,345.67",
    icon: Wallet,
  },
  {
    title: "Total Investments",
    amount: "GHS 50,000.00",
    icon: DollarSign,
  },
  {
    title: "Total Profit",
    amount: "GHS 2,345.67",
    icon: TrendingUp,
  },
  {
    title: "Referral Earnings",
    amount: "GHS 500.00",
    icon: Users,
  },
];

const recentTransactions = [
    { type: 'Investment', amount: 'GHS 5,000.00', status: 'Completed', date: '2 days ago' },
    { type: 'Profit', amount: 'GHS 50.20', status: 'Credited', date: '1 day ago' },
    { type: 'Withdrawal', amount: 'GHS 1,000.00', status: 'Pending', date: '5 hours ago' },
    { type: 'Referral', amount: 'GHS 15.00', status: 'Credited', date: '3 days ago' },
];

const portfolioData = [
  { name: 'SUV-01', value: 20000 },
  { name: 'Sedan-01', value: 15000 },
  { name: 'Luxury-01', value: 10000 },
  { name: 'Sedan-02', value: 5000 },
];

export default function DashboardPage() {
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 animate-fade-in-up" style={{animationDelay: '400ms'}}>
          <CardHeader>
            <CardTitle className="font-headline">Recent Transactions</CardTitle>
            <CardDescription>
              A quick look at your latest activities.
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
                {recentTransactions.map((tx, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{tx.type}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>
                      <Badge variant={tx.status === 'Completed' || tx.status === 'Credited' ? 'default' : 'secondary'}>
                        {tx.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{tx.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 animate-fade-in-up" style={{animationDelay: '500ms'}}>
          <CardHeader>
            <CardTitle className="font-headline">Portfolio Summary</CardTitle>
            <CardDescription>
              Your active investment distribution.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={portfolioData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={60}/>
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} />
                </BarChart>
            </ResponsiveContainer>
            <Button variant="outline" className="w-full mt-4" asChild>
                <Link href="/dashboard/investments">
                    View All Investments <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
