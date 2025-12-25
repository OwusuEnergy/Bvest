import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, TrendingUp, Car } from 'lucide-react';

const stats = [
  {
    name: 'Total Investment',
    value: 'GHS 5M+',
    icon: DollarSign,
  },
  {
    name: 'Happy Investors',
    value: '2,500+',
    icon: Users,
  },
  {
    name: 'Avg. Monthly ROI',
    value: '12.5%',
    icon: TrendingUp,
  },
  {
    name: 'Vehicles Funded',
    value: '150+',
    icon: Car,
  },
];

export function Stats() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={stat.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-headline">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
