
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useAuth } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const ADMIN_MAGIC_CODE = '0596352632';
const ADMIN_EMAIL = 'admin@carvest.com';
const ADMIN_UID = 'pYJb2fT8ZaRjS4eXq2tWz3fG8yH3';


export default function AdminLoginPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (code !== ADMIN_MAGIC_CODE) {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: 'The provided magic code is incorrect.',
        });
        setIsLoading(false);
        return;
    }
    
    try {
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_MAGIC_CODE);
        router.push('/admin');
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                // If the user doesn't exist, create it.
                await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_MAGIC_CODE);
                // After creating, sign in again to be sure
                await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_MAGIC_CODE);
                router.push('/admin');
            } catch (creationError: any) {
                 toast({
                    variant: 'destructive',
                    title: 'Admin Creation Failed',
                    description: creationError.message,
                });
            }
        } else {
            console.error("Admin sign-in error:", error);
            toast({
                variant: 'destructive',
                title: 'Admin Authentication Failed',
                description: 'Could not sign in the admin user. Please check console.',
            });
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="absolute top-8">
        <Logo />
      </div>
      <Card className="w-full max-w-sm animate-fade-in-up">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">Admin Sign In</CardTitle>
          <CardDescription>
            Enter the security magic code to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="magic-code" className="sr-only">Security Code</Label>
              <Input
                id="magic-code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="Enter magic code"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
