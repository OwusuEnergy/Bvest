
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const ADMIN_EMAIL = 'admin@carvest.com';
const ADMIN_MAGIC_CODE = '0596352632';
const ADMIN_UID = "L29dCjetU2WAK2G5QcIWu5TrCg33";

export default function AdminLoginPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  // Redirect if admin is already logged in
  useEffect(() => {
    if (!isUserLoading && user && user.uid === ADMIN_UID) {
      router.replace('/admin/dashboard');
    }
  }, [user, isUserLoading, router]);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== ADMIN_MAGIC_CODE) {
      toast({
        variant: 'destructive',
        title: 'Invalid Code',
        description: 'The magic code you entered is incorrect.',
      });
      return;
    }

    setIsLoading(true);
    try {
        await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_MAGIC_CODE);
        router.replace('/admin/dashboard');
    } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            try {
                await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_MAGIC_CODE);
                await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_MAGIC_CODE);
                router.replace('/admin/dashboard');
            } catch (creationError: any) {
                 toast({
                    variant: 'destructive',
                    title: 'Admin Creation Failed',
                    description: `This can happen if the admin account was created with a different password. Please check your setup. Error: ${creationError.message}`,
                });
            }
        } else {
             toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: error.message,
            });
        }
    } finally {
        setIsLoading(false);
    }
  };
  
    // Don't render the form if we're still checking auth state or if user is an admin
   if (isUserLoading || (user && user.uid === ADMIN_UID)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Admin Access</CardTitle>
          <CardDescription>Enter the magic code to access the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="magic-code">Magic Code</Label>
              <Input
                id="magic-code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enter
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
