
'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { InvestmentDialog } from "@/components/investment-dialog";
import type { Car } from "@/lib/types";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";


export default function InvestmentsPage() {
  const firestore = useFirestore();

  const carsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'cars'), orderBy('name'));
  }, [firestore]);

  const { data: cars, isLoading } = useCollection<Car>(carsQuery);

  return (
    <div className="container py-12 sm:py-16 animate-fade-in">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Available Investments
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose a vehicle to invest in and start earning returns.
        </p>
      </div>

      <div className="mt-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading && Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="flex flex-col animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
                <CardHeader className="p-0">
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="text-sm text-muted-foreground">
                    <Skeleton className="h-4 w-1/4 mb-2" />
                    <Skeleton className="h-2 w-full" />
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
            {cars && cars.map((car, index) => {
                const investmentProgress = car.totalValue > 0 ? (car.investedAmount / car.totalValue) * 100 : 0;
                return (
                    <Card key={car.id} className="flex flex-col animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
                        <CardHeader className="p-0">
                            <div className="relative h-48 w-full">
                                {car.image ? (
                                    <Image
                                        src={car.image}
                                        alt={car.name}
                                        fill
                                        className="object-cover rounded-t-lg"
                                        
                                    />
                                ): (
                                  <div className="h-full w-full bg-secondary rounded-t-lg" />
                                )}
                                <Badge variant="secondary" className="absolute top-2 right-2">{car.roi}% ROI</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow">
                            <CardTitle className="font-headline text-lg mb-2">{car.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mb-4">{car.description}</p>
                            <div className="text-sm text-muted-foreground">
                                <p>Invested: {investmentProgress.toFixed(0)}%</p>
                                <div className="w-full bg-muted rounded-full h-2 my-2">
                                    <div className="bg-primary h-2 rounded-full" style={{width: `${investmentProgress}%`}}></div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4">
                           <InvestmentDialog car={car} />
                        </CardFooter>
                    </Card>
                )
            })}
        </div>
      </div>
    </div>
  );
}
