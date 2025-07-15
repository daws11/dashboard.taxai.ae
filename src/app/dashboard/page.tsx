"use client"
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { AgentSelector } from "@/components/AgentSelector";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { plans } from "@/app/dashboard/account/accountConstants";

type Payment = {
  amount: number;
  method: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
};

type Subscription = {
  type: string;
  status: string;
  messageLimit: number;
  remainingMessages: number;
  startDate: string;
  endDate: string;
  payment: Payment;
  callSeconds?: number; // Added for call time
};

type User = {
  name: string;
  email: string;
  jobTitle?: string;
  language?: string;
  subscription: Subscription;
  trialUsed: boolean;
  createdAt: string;
  updatedAt: string;
};

// Helper untuk format tanggal
function formatDate(dateStr: string, withTime = false) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return withTime
    ? date.toLocaleString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cek apakah trial sudah habis (perlu state agar tidak pakai hook di bawah early return)
  const [trialExpired, setTrialExpired] = useState(false);
  // State untuk dialog
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      if (session?.user?.email) {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
        setLoading(false);
      }
    }
    fetchUser();
  }, [session]);

  useEffect(() => {
    if (user && user.subscription?.type === 'trial') {
      const created = new Date(user.createdAt);
      const now = new Date();
      const trialEnd = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);
      const expired = now > trialEnd;
      setTrialExpired(expired);
      setOpenDialog(expired);
    } else {
      setTrialExpired(false);
      setOpenDialog(false);
    }
  }, [user]);

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950 py-8 px-4 md:px-12">
        <div className="max-w-4xl mx-auto mt-12">
          <div className="flex flex-col md:flex-row gap-8 items-center bg-white dark:bg-blue-950 rounded-2xl shadow-xl p-8 border border-blue-200 dark:border-blue-800">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex-1 w-full space-y-4">
              <Skeleton className="h-8 w-1/2 rounded" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-24 rounded" />
                <Skeleton className="h-6 w-20 rounded" />
                <Skeleton className="h-6 w-32 rounded" />
              </div>
              <Skeleton className="h-5 w-1/3 rounded" />
              <Skeleton className="h-5 w-1/2 rounded" />
              <Skeleton className="h-5 w-full rounded mt-4" />
              <div className="flex gap-4 mt-4">
                <Skeleton className="h-16 w-1/2 rounded-lg" />
                <Skeleton className="h-16 w-1/2 rounded-lg" />
              </div>
              <Skeleton className="h-10 w-40 rounded-lg mt-6" />
            </div>
          </div>
          <div className="mt-8">
            <Skeleton className="h-8 w-1/3 rounded mb-4" />
            <Skeleton className="h-12 w-full rounded" />
          </div>
          <div className="mt-8">
            <Skeleton className="h-8 w-1/4 rounded mb-4" />
            <Skeleton className="h-32 w-full rounded" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">User data not found.</div>;
  }

  const percent = Math.round((user.subscription?.remainingMessages / user.subscription?.messageLimit) * 100);
  const planName = plans.find((p: { key: string; name: string }) => p.key === user.subscription?.type)?.name || 'Unknown Plan';

  // Call time progress bar logic
  const maxCallSeconds = 180;
  const callSeconds = typeof user.subscription?.callSeconds === 'number' ? user.subscription.callSeconds : 0;
  const callPercent = Math.round((callSeconds / maxCallSeconds) * 100);
  function formatSeconds(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950 py-8 px-4 md:px-12">
      <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
        <div className="text-xl md:text-2xl font-bold text-blue-900 dark:text-white flex items-center gap-2">
          <span role="img" aria-label="wave">👋</span>
          Welcome back, <span className="text-blue-700 dark:text-blue-300">{user.name.split(" ")[0]}</span>
        </div>
        <ThemeToggle />
      </div>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Dialog peringatan trial habis */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-md w-full text-center">
            <DialogHeader>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-red-100 dark:bg-red-900 rounded-full p-3 mb-2 flex items-center justify-center">
                  <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-red-600 dark:text-red-300"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><circle cx="12" cy="16" r="1" /></svg>
                </div>
                <DialogTitle className="text-2xl font-bold text-red-700 dark:text-red-300">Trial Period Expired</DialogTitle>
                <DialogDescription className="text-base text-gray-700 dark:text-gray-200 mt-2">
                  Your 14-day trial period has ended. To continue using AI Agent Services, please upgrade your plan.
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="mt-6 flex flex-col gap-2">
              <button
                className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-all text-lg"
                onClick={() => { setOpenDialog(false); window.location.href = '/dashboard/account?tab=Subscription'; }}
              >
                Upgrade Plan
              </button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Alert peringatan trial habis */}
        {trialExpired && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Trial Expired</AlertTitle>
            <AlertDescription>
              Your trial period has ended. You cannot use AI Agent Services until you upgrade your plan.
            </AlertDescription>
          </Alert>
        )}
        <Card className="p-0 overflow-hidden">
          <CardHeader className="flex flex-row items-center gap-6 bg-blue-50 dark:bg-blue-900 p-8 pb-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-bold text-blue-900 dark:text-white mb-1 flex flex-wrap gap-2 items-center">
                {user.name}
                {user.trialUsed && <Badge variant="destructive">Trial Used</Badge>}
              </CardTitle>
              <div className="flex flex-wrap gap-2 items-center mb-1">
                <Badge variant="outline" className="text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700 bg-blue-100 dark:bg-blue-800">
                  {user.subscription?.type?.charAt(0).toUpperCase() + user.subscription?.type?.slice(1)} Plan
                </Badge>
                <Badge variant={trialExpired || user.subscription?.status === 'expired' ? 'destructive' : user.subscription?.status === 'active' ? 'default' : 'secondary'}>
                  {(trialExpired ? 'Expired' : user.subscription?.status?.charAt(0).toUpperCase() + user.subscription?.status?.slice(1))}
                </Badge>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                  Period: {formatDate(user.subscription?.startDate)} - {formatDate(user.subscription?.endDate)}
                </Badge>
              </div>
              <div className="text-blue-700 dark:text-blue-200 text-sm flex items-center gap-2">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" /><path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.07 7.07-1.42-1.42M6.34 6.34 4.93 4.93m12.02 0-1.41 1.41M6.34 17.66l-1.41 1.41" /></svg>
                {user.email}
              </div>
              {user.jobTitle && <div className="text-blue-500 dark:text-blue-300 text-sm flex items-center gap-2"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 20v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" /><circle cx="12" cy="8" r="4" /></svg>{user.jobTitle}</div>}
              {user.language && <div className="text-blue-500 dark:text-blue-300 text-sm flex items-center gap-2"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2Z" /></svg>{user.language}</div>}
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-8 px-8">
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-2 items-center mt-2">
              <span className="text-sm font-semibold text-blue-900 dark:text-white flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg> Messages Left:</span>
              <span className="text-sm font-mono text-blue-700 dark:text-blue-200">{user.subscription?.remainingMessages} / {user.subscription?.messageLimit} ({percent}%)</span>
            </div>
            <div className="w-full bg-blue-100 dark:bg-blue-900 rounded-full h-5 flex items-center relative shadow-inner mt-2">
              <div
                className="h-5 rounded-full bg-blue-600 dark:bg-blue-400 transition-all"
                style={{ width: `${percent}%` }}
              />
              <span className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-blue-900 dark:text-white">
                {user.subscription?.remainingMessages} / {user.subscription?.messageLimit} ({percent}%)
              </span>
            </div>
            {/* Call time progress bar */}
            <div className="flex flex-wrap gap-2 items-center mt-4">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg> Call Time Left:</span>
              <span className="text-sm font-mono text-blue-700 dark:text-blue-200">{formatSeconds(callSeconds)} / 03:00 ({callPercent}%)</span>
            </div>
            <div className="w-full bg-blue-100 dark:bg-blue-900 rounded-full h-5 flex items-center relative shadow-inner mt-2">
              <div
                className="h-5 rounded-full bg-blue-400 dark:bg-blue-500 transition-all"
                style={{ width: `${callPercent}%` }}
              />
              <span className="absolute left-1/2 -translate-x-1/2 text-xs font-semibold text-blue-900 dark:text-blue-100">
                {formatSeconds(callSeconds)} / 03:00 ({callPercent}%)
              </span>
            </div>
            <Separator className="my-4" />
            <div className="flex flex-col md:flex-row gap-4 mt-2">
              <div className="flex-1 bg-blue-50 dark:bg-blue-900 rounded-lg p-4 shadow flex flex-col gap-1">
                <div className="font-semibold text-blue-900 dark:text-white flex items-center gap-2 mb-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg> Payment Info</div>
                {trialExpired && (
                  <div className="mb-2 p-3 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 flex flex-col md:flex-row items-center gap-3 text-sm">
                    <span className="flex items-center"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><circle cx="12" cy="16" r="1" /></svg></span>
                    <span className="flex-1 font-semibold">Your trial period has expired. Upgrade your plan to continue using the service.</span>
                    <button
                      className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-all text-sm"
                      onClick={() => window.location.href = '/dashboard/account?tab=Subscription'}
                    >Upgrade Plan</button>
                  </div>
                )}
                {user.subscription?.type === 'trial' ? (
                  (() => {
                    const created = new Date(user.createdAt);
                    const now = new Date();
                    const trialEnd = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);
                    const diffTime = trialEnd.getTime() - now.getTime();
                    const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                    if (!trialExpired) {
                      return (
                        <div className="font-semibold text-blue-700 dark:text-blue-300">
                          Trial ends in: <span className="text-blue-600 dark:text-blue-200">{diffDays} day{diffDays !== 1 ? 's' : ''}</span>
                        </div>
                      );
                    }
                    return null;
                  })()
                ) : (
                  <>
                    <div className="text-sm">Amount: <span className="font-medium">${user.subscription?.payment?.amount}</span></div>
                    <div className="text-sm">Method: {user.subscription?.payment?.method}</div>
                    <div className="text-sm">Last Payment: {formatDate(user.subscription?.payment?.lastPaymentDate, true)}</div>
                    <div className="text-sm">Next Payment: {formatDate(user.subscription?.payment?.nextPaymentDate, true)}</div>
                  </>
                )}
              </div>
              <div className="flex-1 bg-blue-50 dark:bg-blue-900 rounded-lg p-4 shadow flex flex-col gap-1">
                <div className="font-semibold text-blue-900 dark:text-white flex items-center gap-2 mb-1"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /><circle cx="12" cy="12" r="10" /></svg> Account Info</div>
                <div className="text-sm">Trial Used: <span className={user.trialUsed ? 'text-red-600' : 'text-green-600'}>{user.trialUsed ? 'Yes' : 'No'}</span></div>
                <div className="text-sm">Created: {formatDate(user.createdAt, true)}</div>
                <div className="text-sm">Updated: {formatDate(user.updatedAt, true)}</div>
              </div>
            </div>
            <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 dark:hover:bg-blue-900 transition-all shadow-lg" onClick={() => window.location.href = "/dashboard/account"}>
              <span className="flex items-center gap-2"><svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg> Manage Account</span>
            </Button>
          </CardContent>
        </Card>
        <section className="bg-white dark:bg-blue-950 rounded-2xl shadow-xl p-8 border border-blue-200 dark:border-blue-800">
          <h2 className="text-lg font-semibold text-blue-900 dark:text-white mb-4 flex items-center gap-2"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" /></svg> AI Agent Services</h2>
          <AgentSelector disabled={trialExpired} planName={planName} />
        </section>
      </div>
    </main>
  );
} 