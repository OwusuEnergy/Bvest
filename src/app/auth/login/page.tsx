
'use client';

import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { Loader2 } from 'lucide-react';

function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-96 w-full max-w-sm items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}

export default LoginPage;
