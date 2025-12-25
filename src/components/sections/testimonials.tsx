import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ama Serwaa",
    title: "Small Business Owner",
    avatarId: "avatar-2",
    rating: 5,
    quote: "CarVest has been a game-changer for my finances. The daily profits are consistent, and the platform is so easy to use. I've already recommended it to all my friends!",
  },
  {
    name: "Kofi Mensah",
    title: "Software Developer",
    avatarId: "avatar-1",
    rating: 5,
    quote: "As someone in tech, I appreciate the transparency and security of CarVest. The AI calculator is surprisingly accurate, and seeing my investment grow daily is incredibly motivating.",
  },
  {
    name: "Esi Nana",
    title: "University Student",
    avatarId: "avatar-3",
    rating: 4,
    quote: "I started with a small investment, and it's been the perfect way to learn about passive income. The referral system is a great bonus. Highly recommend for anyone starting out.",
  }
];

export function Testimonials() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container">
        <div className="text-center animate-fade-in-up">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by Investors Like You
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            See what our community is saying about their journey with CarVest.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const avatar = PlaceHolderImages.find(img => img.id === testimonial.avatarId);
            return (
              <Card key={testimonial.name} className="flex flex-col animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <CardContent className="flex-grow p-6">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-accent fill-accent' : 'text-muted-foreground/50'}`}
                      />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-muted-foreground">
                    <p>"{testimonial.quote}"</p>
                  </blockquote>
                </CardContent>
                <CardHeader className="flex-row items-center gap-4 pt-0 p-6">
                  {avatar && (
                    <Avatar>
                      <AvatarImage src={avatar.imageUrl} alt={testimonial.name} data-ai-hint={avatar.imageHint} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
