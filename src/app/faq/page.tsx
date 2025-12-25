"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

const allFaqItems = [
  // General
  {
    category: "General",
    question: "What is CarVest?",
    answer: "CarVest is a platform that allows you to invest in a portfolio of car rentals and earn daily profits. We handle the car acquisition, management, and rental process, so you can enjoy passive income.",
  },
  {
    category: "General",
    question: "Who can invest on CarVest?",
    answer: "Anyone with a valid Ghanaian ID and a bank account or mobile money wallet can invest. You must be 18 years or older.",
  },
  // Investments
  {
    category: "Investments",
    question: "What is the minimum investment?",
    answer: "The minimum investment amount is GHS 100.",
  },
  {
    category: "Investments",
    question: "How is my profit calculated?",
    answer: "Profits are calculated daily based on the car's rental performance, your investment amount, and the specified ROI for the vehicle. You can see your daily earnings in your dashboard.",
  },
  {
    category: "Investments",
    question: "What is ROI and how is it determined?",
    answer: "ROI stands for Return on Investment. It's the percentage of profit you can expect from your investment over a period. We determine the ROI for each car based on its type, market demand, operational costs, and historical performance.",
  },
  {
    category: "Investments",
    question: "Can I lose money?",
    answer: "All investments carry some level of risk. However, we mitigate this by investing in high-demand rental cars, maintaining them professionally, and having comprehensive insurance. Our model is designed for steady returns, but we encourage you to read our Risk Disclosure.",
  },
  // Referrals
  {
    category: "Referrals",
    question: "How does the referral system work?",
    answer: "You earn a commission on the profits of users you refer. We have a multi-level system where you can earn from your direct referrals (Level 1) and their referrals (Level 2 & 3).",
  },
  {
    category: "Referrals",
    question: "Where can I find my referral link?",
    answer: "Your unique referral link is available in the 'Referrals' section of your dashboard once you create an account.",
  },
  // Withdrawals
  {
    category: "Withdrawals",
    question: "How can I withdraw my earnings?",
    answer: "You can request a withdrawal from your dashboard. We process withdrawals to Ghanaian bank accounts and all major Mobile Money networks (MTN, Vodafone, AirtelTigo).",
  },
  {
    category: "Withdrawals",
    question: "What is the minimum withdrawal amount?",
    answer: "The minimum amount you can withdraw is GHS 100.",
  },
];

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) return allFaqItems;
    return allFaqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container py-12 sm:py-16">
          <div className="text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Find answers to common questions about CarVest.
            </p>
          </div>

          <div className="mt-10 max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search questions..."
                className="w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Accordion type="single" collapsible className="mt-6 w-full">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((item, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <p className="text-center text-muted-foreground mt-8">No questions found for your search.</p>
              )}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
