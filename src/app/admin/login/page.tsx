
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

const ADMIN_MAGIC_CODE = '0596352632';

export default function AdminLoginPage() {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (code === ADMIN_MAGIC_CODE) {
      toast({
        title: 'Success',
        description: 'Login successful. Redirecting...',
      });
      // In a real app, you'd set a secure, http-only cookie or session.
      // For this example, we'll use sessionStorage.
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      router.push('/admin');
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'The provided magic code is incorrect.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-8">
        <Logo />
      </div>
      <Card className="w-full max-w-sm animate-fade-in-up">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Admin Sign In</CardTitle>
          <CardDescription>
            Enter the security magic code to access the admin panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="magic-code">Security Code</Label>
              <Input
                id="magic-code"
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="********"
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
