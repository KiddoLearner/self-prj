'use client';
import { Button, buttonVariants } from '@/src/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/src/components/ui/dropdown-menu'

import Logo from '@/src/components/shadcn-studio/logo'
import { SearchIcon, MenuIcon, LogIn } from 'lucide-react'
import { authClient } from '@/src/lib/auth/client'
import Link from 'next/link';
import { cn } from '@/src/lib/utils';
import { SignOut } from '@neondatabase/auth-ui';
import SignOutButton from '@/src/app/component/Nav/SignOutButton';

type NavigationItem = {
  title: string
  href: string
}[]

function Navbar  ({ navigationData }: { navigationData: NavigationItem }) {

  // Get User Info
  const {data:session, isPending} = authClient.useSession();
  const user = session?.user;
  

  return (
    <div className='bg-background sticky top-0 z-50'>
      {/* <div className='mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-7 sm:px-6'> */}
      <div className="relative mx-auto flex min-h-20 max-w-7xl items-center px-4 py-7 sm:px-6">
        {/* <div className='text-muted-foreground flex flex-1 items-center gap-8 font-medium md:justify-center lg:gap-16'> */}
        <div className="text-muted-foreground absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 font-medium md:flex lg:gap-16">
          {
            navigationData.map((item) => (
              <a key={item.title} href={item.href} className='hover:text-primary max-md:hidden'>
                {item.title}
              </a>
            ))
          }
        </div>

        {/* <div className='flex items-center gap-6'> */}
        <div className="ml-auto flex items-center gap-6">
          <div className='md:block hidden'>
          {user?
            <>
            {/* <SignOut> */}
            {
              user?.name && <span className="text-[14px] text-gray-600 dark:text-gray-300">
                {`Hello, ${user?.name.split(" ")[0]}!`}
              </span>
            }
            <SignOutButton/>
            </>:
            <>
              {/* <SignIn> */}
            <SignIn/>
            </>
          }</div>
            
            
            <span className='sr-only'>Search</span>
          <DropdownMenu>
            <DropdownMenuTrigger className='md:hidden' render={<Button variant='outline' size='icon' />}>
              <MenuIcon />
              <span className='sr-only'>Menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56' align='end'>
              <DropdownMenuGroup>
                {navigationData.map((item, index) => (
                  <DropdownMenuItem key={index}>
                    <a href={item.href}>{item.title}</a>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem key="logout">
                  {user?
                    <><SignOutButton/><span>Sign Out</span></>:<><SignIn/>Sign In</>
                }
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default Navbar

const SignIn = () => {
  return (
    <Link
      href="/auth/sign-in"
      className={cn(
        buttonVariants({ variant: "ghost", size: "default" }),
        "flex items-center gap-2 px-0"
      )}
    >
      <LogIn className="w-4 h-4" />
      <span className="hidden lg:inline">Sign in</span>
    </Link>
  );
};