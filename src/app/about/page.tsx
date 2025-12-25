import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Target } from 'lucide-react';
import Image from 'next/image';

const missionPoints = [
  "To provide accessible and transparent investment opportunities for everyone.",
  "To leverage technology for financial growth and empowerment.",
  "To build a community of smart investors driving their own wealth.",
];

export default function AboutPage() {
  const storyImage = PlaceHolderImages.find((img) => img.id === 'car-suv');

  return (
    <div className="container py-12 sm:py-16 animate-fade-in-up">
      <div className="text-center">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Driving Financial Freedom in Ghana
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          BVest was born from a simple idea: what if anyone could invest in the lucrative car rental market, without needing to own a car?
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-headline text-2xl font-semibold text-foreground">Our Story</h2>
          <p className="mt-4 text-muted-foreground">
            Founded in Accra, BVest started with a small fleet and a big vision. We saw the high demand for rental vehicles from ride-sharing drivers and businesses, but recognized the high barrier to entry for individual investors. We decided to change that.
          </p>
          <p className="mt-4 text-muted-foreground">
            By creating a platform for fractional investment in vehicles, we've opened up a new asset class to everyday Ghanaians. Our model ensures that as our cars earn on the road, our investors earn in their pockets, creating a cycle of shared growth and prosperity.
          </p>
        </div>
        <div className="relative h-80 w-full">
          {storyImage && (
            <Image
              src={storyImage.imageUrl}
              alt="BVest Story"
              fill
              className="rounded-lg object-cover shadow-lg animate-fade-in"
              data-ai-hint={storyImage.imageHint}
            />
          )}
        </div>
      </div>

      <div className="mt-20">
        <Card className="bg-primary/5 dark:bg-card animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Target className="h-6 w-6 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {missionPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
