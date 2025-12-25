
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/page-header";
import { Car, Users, Banknote, TrendingUp } from "lucide-react";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";

const kpiCards = [
    { title: "Total Revenue", icon: TrendingUp, value: "GHS 125,430", change: "+20.1% from last month" },
    { title: "Total Investments", icon: Banknote, value: "842", change: "+150 this month" },
    { title: "Active Users", icon: Users, value: "1,230", change: "+50 new users" },
    { title: "Listed Cars", icon: Car, value: "45", change: "+5 new cars" },
]

export default function AdminDashboardPage() {
    const firestore = useFirestore();

    const usersQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'users'));
    }, [firestore]);
    const { data: users, isLoading: usersLoading } = useCollection(usersQuery);

    const carsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(collection(firestore, 'cars'));
    }, [firestore]);
    const { data: cars, isLoading: carsLoading } = useCollection(carsQuery);

    const formatCurrency = (amount: number = 0) => {
        return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', currencyDisplay: 'symbol' }).format(amount);
    }
    
    const totalInvested = users?.reduce((acc, user) => acc + (user.totalInvested || 0), 0);

    const stats = [
        {
          title: "Total Invested",
          value: formatCurrency(totalInvested),
          icon: Banknote,
          description: "Total amount invested by all users."
        },
        {
          title: "Total Users",
          value: users?.length ?? 0,
          icon: Users,
          description: "Total number of registered users."
        },
        {
          title: "Total Cars",
          value: cars?.length ?? 0,
          icon: Car,
          description: "Total number of cars for investment."
        },
      ];


    return (
        <div className="animate-fade-in-up">
            <PageHeader
                title="Admin Dashboard"
                description="An overview of the BVest platform."
            />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                     <Card key={stat.title} className="animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

    