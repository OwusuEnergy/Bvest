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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, differenceInDays, addMonths, parseISO } from 'date-fns';

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

export default function MyInvestmentsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          My Investments
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Track the performance and maturity of your active investments.
        </p>
      </div>

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
  );
}
