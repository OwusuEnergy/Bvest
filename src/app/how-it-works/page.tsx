import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    title: "Create Your Account",
    description: "Sign up in minutes with your email. It's free and secure.",
  },
  {
    title: "Choose an Investment",
    description: "Browse our selection of cars, view their potential ROI, and pick one that fits your goals.",
  },
  {
    title: "Invest Securely",
    description: "Make your investment using our secure payment gateways like Flutterwave or Paystack.",
  },
  {
    title: "Earn Daily Profits",
    description: "Watch your investment grow with daily profit calculations added to your account.",
  },
  {
    title: "Withdraw Your Earnings",
    description: "Easily withdraw your profits and capital to your Mobile Money or bank account.",
  },
];

const faqItems = [
    {
      question: "What is the minimum investment?",
      answer: "The minimum investment amount is GHS 100.",
    },
    {
      question: "How is my profit calculated?",
      answer: "Profits are calculated daily based on the car's rental performance and your investment amount. You can see your daily earnings in your dashboard.",
    },
    {
      question: "Is my investment safe?",
      answer: "While all investments carry some risk, we mitigate this by investing in high-demand rental cars and maintaining them professionally. Our platform uses industry-standard security for all data and transactions.",
    },
    {
      question: "How does the referral system work?",
      answer: "You earn a commission on the profits of users you refer. We have a multi-level system where you can earn from your direct referrals (Level 1) and their referrals (Level 2 & 3).",
    },
  ];

export default function HowItWorksPage() {
  return (
    <div className="container py-12 sm:py-16">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          How CarVest Works
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A simple, transparent process to put your money to work.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-headline text-2xl font-semibold mb-6">Five Simple Steps to Start Earning</h2>
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Card className="bg-primary/5 dark:bg-card">
            <CardHeader>
                <CardTitle className="font-headline">The Process</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{step.title}</span>
                    </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
      </div>

      <div className="mt-16">
        <div className="text-center">
            <h2 className="font-headline text-2xl font-semibold">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="mt-6 max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  );
}
