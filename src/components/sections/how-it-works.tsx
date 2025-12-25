import { Button } from "../ui/button";
import { authLinks } from "@/lib/constants";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

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
    description: "Make your investment using our secure payment gateways.",
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

export function HowItWorks() {
    const suvImage = PlaceHolderImages.find(img => img.id === 'car-suv');

    return (
    <section className="py-12 sm:py-16">
        <div className="container">
            <div className="text-center animate-fade-in-up">
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    How BVest Works
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    A simple, transparent process to put your money to work in just a few steps.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-12 items-center lg:grid-cols-2">
                <div className="relative h-96 w-full animate-fade-in-up" style={{animationDelay: '200ms'}}>
                    {suvImage && (
                        <Image
                            src={suvImage.imageUrl}
                            alt="How it works illustration"
                            fill
                            className="object-cover rounded-lg shadow-lg"
                            data-ai-hint={suvImage.imageHint}
                        />
                    )}
                </div>
                <div className="space-y-6">
                    {steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                        {index + 1}
                        </div>
                        <div>
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <div className="text-center mt-12 animate-fade-in-up" style={{animationDelay: '800ms'}}>
                <Button size="lg" asChild>
                    <Link href={authLinks.signup}>Start Investing Today</Link>
                </Button>
            </div>
        </div>
    </section>
  );
}
