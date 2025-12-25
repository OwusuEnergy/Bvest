import { RoiCalculator } from "@/components/roi-calculator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";

const cars = [
    { id: 'suv-01', name: 'Standard SUV', roi: 12, imageId: 'car-suv', slots: 5, totalValue: 150000, investedAmount: 75000 },
    { id: 'sedan-01', name: 'Economy Sedan', roi: 9.5, imageId: 'car-sedan', slots: 2, totalValue: 80000, investedAmount: 60000 },
    { id: 'luxury-01', name: 'Luxury Sportscar', roi: 15, imageId: 'car-luxury', slots: 10, totalValue: 400000, investedAmount: 120000 },
    { id: 'sedan-02', name: 'Comfort Sedan', roi: 10, imageId: 'car-sedan', slots: 0, totalValue: 95000, investedAmount: 95000 },
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

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {cars.map((car, index) => {
                    const carImage = PlaceHolderImages.find(img => img.id === car.imageId);
                    const investmentProgress = (car.investedAmount / car.totalValue) * 100;
                    return (
                        <Card key={car.id} className="animate-fade-in-up" style={{animationDelay: `${index * 150}ms`}}>
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
                            <CardContent className="p-4">
                                <CardTitle className="font-headline text-lg mb-2">{car.name}</CardTitle>
                                <div className="text-sm text-muted-foreground">
                                    <p>Invested: {investmentProgress.toFixed(0)}%</p>
                                    <div className="w-full bg-muted rounded-full h-2 my-2">
                                        <div className="bg-primary h-2 rounded-full" style={{width: `${investmentProgress}%`}}></div>
                                    </div>
                                    <p>{car.slots} slots available</p>
                                </div>
                            </CardContent>
                            <CardFooter className="p-4">
                                <Button asChild className="w-full" disabled={car.slots === 0}>
                                    <Link href={`/dashboard/invest?car=${car.id}`}>{car.slots > 0 ? 'Invest Now' : 'Fully Funded'}</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 animate-fade-in-up" style={{animationDelay: '300ms'}}>
            <RoiCalculator />
          </div>
        </div>
      </div>
    </div>
  );
}
