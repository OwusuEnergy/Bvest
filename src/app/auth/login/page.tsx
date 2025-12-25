import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { authLinks } from "@/lib/constants";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function LoginPage() {
  return (
    <Tabs defaultValue="login" className="w-full max-w-sm animate-fade-in-up">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Sign In</TabsTrigger>
        <TabsTrigger value="create-account">Create Account</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={authLinks.dashboard}>Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="create-account">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Create Account
            </CardTitle>
            <CardDescription>
              Create an account to start investing.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Max Robinson" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email-signup"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password-signup" type="password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={authLinks.dashboard}>Create account</Link>
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
