
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { authLinks } from '@/lib/constants';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth, useFirestore } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { collection, doc, getDocs, query, serverTimestamp, writeBatch, where } from 'firebase/firestore';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required.'),
});

const signupSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email(),
  phone: z.string().min(1, 'Phone number is required.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const refCode = searchParams.get('ref');

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', phone: '', password: '' },
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push(authLinks.dashboard);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      let referrerId: string | null = null;
      if (refCode) {
        const usersRef = collection(firestore, 'users');
        const q = query(usersRef, where('referralCode', '==', refCode));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const referrerDoc = querySnapshot.docs[0];
          referrerId = referrerDoc.id;
        } else {
          toast({
            variant: 'destructive',
            title: 'Invalid Referral Code',
            description: 'The referral code you used is not valid.',
          });
          // Do not proceed if referral code is invalid
          setIsLoading(false);
          return;
        }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: values.name });

      const batch = writeBatch(firestore);

      const userDocRef = doc(firestore, 'users', user.uid);
      const userData: any = {
        id: user.uid,
        name: values.name,
        email: values.email,
        phone: values.phone,
        balance: 10, // Signup bonus
        totalEarned: 10, // Signup bonus
        totalInvested: 0,
        referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
        referralEarnings: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (referrerId) {
        userData.referredById = referrerId;
      }
      batch.set(userDocRef, userData);

      // Add transaction for signup bonus
      const transactionRef = doc(collection(firestore, `users/${user.uid}/transactions`));
        batch.set(transactionRef, {
            userId: user.uid,
            type: 'Signup Bonus',
            amount: 10,
            balanceAfter: 10,
            description: `Welcome bonus for signing up.`,
            createdAt: serverTimestamp(),
        });


      if (referrerId) {
        const referralRef = doc(collection(firestore, `users/${referrerId}/referrals`));
        batch.set(referralRef, {
            referredId: user.uid,
            referredName: values.name,
            referredEmail: values.email,
            level: 1,
            commissionRate: 0.30, // 30%
            earned: 0,
            status: 'active',
            createdAt: serverTimestamp()
        });
      }

      await batch.commit();

      router.push(authLinks.dashboard + '?new_user=true');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };


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
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="grid gap-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type={showPassword ? 'text' : 'password'} {...field} className="pr-10" />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <Button type="submit" className="w-full" disabled={isLoading}>
                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </Form>
          </CardContent>
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
              {refCode && <p className="mt-2 text-sm text-primary">You are signing up with referral code: <strong>{refCode}</strong></p>}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="grid gap-4">
                 <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Max Robinson" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 0241234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input type={showSignupPassword ? 'text' : 'password'} {...field} className="pr-10" />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                        >
                          {showSignupPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
