"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import SidebarLink from "@/components/SidebarLink";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

function Logo() {
  return (
    <div className="flex items-center gap-2 mb-8">
      <img src="/taxai-logo.png" alt="TaxAi Logo" className="h-10 w-auto" />
      <span className="text-xl font-bold text-blue-700 dark:text-blue-200">TaxAI</span>
    </div>
  );
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 8h2v-2H7v2zm0-4h2v-2H7v2zm0-4h2V7H7v2zm4 8h8v-2h-8v2zm0-4h8v-2h-8v2zm0-6v2h8V7h-8z" /></svg>
  ) },
  { href: "/dashboard/account", label: "Account Management", icon: (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" /></svg>
  ) },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const [open, setOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  function isActiveSidebarLink(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  const user = session?.user;

  const handleLogout = () => {
    setShowLogout(false);
    signOut({ callbackUrl: "/" });
  };

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center text-blue-900 dark:text-white">Loading...</div>;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex bg-blue-50 dark:bg-blue-950 pl-0 md:pl-64">
        {/* Mobile sidebar trigger */}
        <div className="md:hidden fixed top-4 left-4 z-30">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="border-blue-300 dark:border-blue-700">
                <span className="sr-only">Open sidebar</span>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-white dark:bg-blue-900 border-r border-blue-200 dark:border-blue-800 flex flex-col h-full">
              <div className="p-6">
                <Logo />
                <nav className="flex flex-col gap-2 overflow-y-auto max-h-[60vh]">
                  {user ? navLinks.map(link => (
                    <SidebarLink key={link.href} href={link.href} label={link.label} icon={link.icon} active={isActiveSidebarLink(link.href)} onClick={() => setOpen(false)} tooltip={link.label} />
                  )) : (
                    <SidebarLink href="/" label="Login" icon={<svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M15 12H3m0 0l4-4m-4 4l4 4m13-8v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6' /></svg>} active={pathname === "/"} tooltip="Login" />
                  )}
                </nav>
                {user && <>
                  <Separator className="my-6" />
                  <div className="flex items-center gap-3 mt-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
                      <AvatarFallback>{user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-blue-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-blue-700 dark:text-blue-300">{user.email}</div>
                    </div>
                  </div>
                </>}
              </div>
              <div className="mt-auto p-6 flex flex-col gap-3">
                <ThemeToggle />
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="w-full">User Menu</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => { setOpen(false); router.push("/dashboard/account"); }}>Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowLogout(true)}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => router.push("/")}>Login</Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* Desktop sidebar */}
        <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 z-20 bg-white dark:bg-blue-900 border-r border-blue-200 dark:border-blue-800 flex-col py-8 px-4">
          <Logo />
          <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {user ? navLinks.map(link => (
              <SidebarLink key={link.href} href={link.href} label={link.label} icon={link.icon} active={isActiveSidebarLink(link.href)} tooltip={link.label} />
            )) : (
              <SidebarLink href="/" label="Login" icon={<svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M15 12H3m0 0l4-4m-4 4l4 4m13-8v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6' /></svg>} active={pathname === "/"} tooltip="Login" />
            )}
          </nav>
          {user && <>
            <Separator className="my-6" />
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
                <AvatarFallback>{user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-blue-900 dark:text-white">{user.name}</div>
                <div className="text-xs text-blue-700 dark:text-blue-300">{user.email}</div>
              </div>
            </div>
            <div className="mt-auto flex flex-col gap-3">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">User Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => router.push("/dashboard/account")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLogout(true)}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>}
          {!user && <Button variant="outline" className="w-full mt-8" onClick={() => router.push("/")}>Login</Button>}
        </aside>
        <main className="flex-1 min-h-screen">{children}</main>
        {/* Logout Dialog */}
        <Dialog open={showLogout} onOpenChange={setShowLogout}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogTitle>Confirm Logout</DialogTitle>
            <div className="mb-4">Are you sure you want to logout?</div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowLogout(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
} 