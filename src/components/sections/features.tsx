import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleDollarSign, Users, Calculator, ShieldCheck } from 'lucide-react';

const features = [
  {
    title: 'Flexible Car Investments',
    description: 'Browse a curated selection of vehicles, choose your investment amount, and start earning. It\'s that simple.',
    icon: CircleDollarSign,
  },
  {
    title: 'AI-Powered ROI Calculator',
    description: 'Use our smart calculator to predict your potential returns based on real-time market data and trends.',
    icon: Calculator,
  },
  {
    title: 'Lucrative Referral System',
    description: 'Invite friends and earn commissions on their profits across multiple levels. A true win-win.',
    icon: Users,
  },
  {
    title: 'Secure & Transparent',
    description: 'Your funds are secured with top-tier payment gateways. Track every transaction and profit with ease.',
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <section className="bg-muted/30 py-12 sm:py-16">
      <div className="container">
        <div className="text-center animate-fade-in-up">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need for Smart Investing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A powerful platform designed for both new and experienced investors.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={feature.title} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
              <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
