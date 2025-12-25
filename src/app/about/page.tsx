import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Target, Users } from 'lucide-react';
import Image from 'next/image';

const teamMembers = [
  {
    name: 'Kofi Ampah',
    role: 'Founder & CEO',
    avatarId: 'avatar-1',
    bio: 'Visionary leader with a passion for democratizing investment opportunities in Ghana.'
  },
  {
    name: 'Ama Boateng',
    role: 'Head of Operations',
    avatarId: 'avatar-2',
    bio: 'Expert in fleet management and ensuring our investment vehicles are always profitable.'
  },
  {
    name: 'Yaw Osei',
    role: 'Lead Developer',
    avatarId: 'avatar-3',
    bio: 'The mastermind behind our secure and user-friendly platform.'
  }
];

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
          CarVest was born from a simple idea: what if anyone could invest in the lucrative car rental market, without needing to own a car?
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="font-headline text-2xl font-semibold text-foreground">Our Story</h2>
          <p className="mt-4 text-muted-foreground">
            Founded in Accra, CarVest started with a small fleet and a big vision. We saw the high demand for rental vehicles from ride-sharing drivers and businesses, but recognized the high barrier to entry for individual investors. We decided to change that.
          </p>
          <p className="mt-4 text-muted-foreground">
            By creating a platform for fractional investment in vehicles, we've opened up a new asset class to everyday Ghanaians. Our model ensures that as our cars earn on the road, our investors earn in their pockets, creating a cycle of shared growth and prosperity.
          </p>
        </div>
        <div className="relative h-80 w-full">
          {storyImage && (
            <Image
              src={storyImage.imageUrl}
              alt="CarVest Story"
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

      <div className="mt-20">
        <div className="text-center">
          <h2 className="font-headline text-2xl font-semibold text-foreground flex items-center justify-center gap-2">
            <Users className="h-6 w-6 text-primary"/>
            Meet the Team
          </h2>
          <p className="mt-2 text-muted-foreground">
            The passionate individuals behind CarVest.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member, index) => {
            const avatar = PlaceHolderImages.find(img => img.id === member.avatarId);
            return (
              <Card key={member.name} className="text-center animate-fade-in-up" style={{animationDelay: `${0.3 + index * 0.1}s`}}>
                <CardContent className="p-6">
                  {avatar && 
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      <AvatarImage src={avatar.imageUrl} alt={member.name} data-ai-hint={avatar.imageHint} />
                      <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                  }
                  <h3 className="font-headline text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
