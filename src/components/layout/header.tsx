'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authLinks, publicNavLinks } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { MobileNav } from './mobile-nav';
import { ThemeToggle } from '../theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Wallet } from 'lucide-react';
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { doc } from 'firebase/firestore';
import { DepositDialog } from '../deposit-dialog';

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userProfile } = useDoc<{balance: number}>(userProfileRef);

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(amount);
  }

  const handleLogout = async () => {
    await signOut(auth);
  };

  const getInitials = (name?: string | null) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1 && nameParts[0] && nameParts[nameParts.length-1]) {
      return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    }
    if (nameParts[0]){
      return nameParts[0][0];
    }
    return '';
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Logo />
        <div className="hidden flex-1 items-center justify-end space-x-6 md:flex">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {publicNavLinks.map((link) =>
              link.children ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'flex items-center gap-1 transition-colors hover:text-primary',
                        link.children.some((child) => child.path === pathname)
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      {link.name}
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {link.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link href={child.path}>{child.name}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.path}
                  href={link.path!}
                  className={cn(
                    'transition-colors hover:text-primary',
                    pathname === link.path ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {link.name}
                </Link>
              )
            )}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isUserLoading ? (
              <div className='w-[180px] h-10 bg-muted rounded-md animate-pulse' />
            ) : user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Wallet className="h-5 w-5" />
                      <span className="sr-only">Open wallet menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Wallet Balance</p>
                        <p className="text-lg font-semibold leading-none text-foreground">{formatCurrency(userProfile?.balance)}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DepositDialog user={user}>
                       <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Deposit</DropdownMenuItem>
                    </DepositDialog>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/withdraw">Withdraw</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" asChild>
                  <Link href={authLinks.dashboard}>Dashboard</Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                       <Avatar className="h-8 w-8">
                          {user.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.displayName || 'User Avatar'} />
                          ) : (
                            <AvatarFallback>{getInitials(user.displayName) || user.email?.charAt(0)?.toUpperCase()}</AvatarFallback>
                          )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href={authLinks.login}>Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href={authLinks.signup}>Create Account</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 md:hidden">
           {user && !isUserLoading && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Wallet className="h-5 w-5" />
                  <span className="sr-only">Open wallet menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Wallet Balance</p>
                    <p className="text-lg font-semibold leading-none text-foreground">{formatCurrency(userProfile?.balance)}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DepositDialog user={user}>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Deposit</DropdownMenuItem>
                </DepositDialog>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/withdraw">Withdraw</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
