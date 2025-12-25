
'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { InvestmentDialog } from "@/components/investment-dialog";
import type { Car } from "@/lib/types";


const cars: Car[] = [
    { id: 'suv-01', name: 'Standard SUV', roi: 12, imageId: 'car-suv', totalValue: 150000, investedAmount: 75000, description: 'A reliable and spacious SUV perfect for families and long trips.' },
    { id: 'sedan-01', name: 'Economy Sedan', roi: 9.5, imageId: 'car-sedan', totalValue: 80000, investedAmount: 60000, description: 'An efficient and comfortable sedan ideal for city driving.' },
    { id: 'luxury-01', name: 'Luxury Sportscar', roi: 15, imageId: 'car-luxury', totalValue: 400000, investedAmount: 120000, description: 'Experience performance and style with this premium sportscar.' },
    { id: 'sedan-02', name: 'Comfort Sedan', roi: 10, imageId: 'car-sedan', totalValue: 95000, investedAmount: 95000, description: 'A comfortable and stylish sedan for a smooth ride.' },
];

export default function InvestmentsPage() {
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
            {cars.map((car, index) => {
                const carImage = PlaceHolderImages.find(img => img.id === car.imageId);
                const investmentProgress = (car.investedAmount / car.totalValue) * 100;
                return (
                    <Card key={car.id} className="flex flex-col animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
                        <CardHeader className="p-0">
                            <div className="relative h-48 w-full">
                                {carImage && (
                                    <Image
                                        src={carImage.imageUrl}
                                        alt={car.name}
                                        fill
                                        className="object-cover rounded-t-lg"
                                        data-ai-hint={carImage.imageHint}
                                    />
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
