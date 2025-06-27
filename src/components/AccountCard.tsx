"use client";
import { Card } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export interface SubscriptionPayment {
  amount: number;
  method: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
}

export interface Subscription {
  type: 'monthly' | 'quarterly' | 'yearly' | 'trial';
  status: 'active' | 'expired' | 'pending';
  messageLimit: number;
  remainingMessages: number;
  startDate: string;
  endDate: string;
  payment: SubscriptionPayment;
}

export interface AccountCardProps {
  name: string;
  email: string;
  jobTitle?: string;
  language?: string | null;
  subscription: Subscription;
  trialUsed: boolean;
  createdAt: string;
  updatedAt: string;
  avatarUrl?: string;
}

export function AccountCard({ name, email, jobTitle, language, subscription, trialUsed, createdAt, updatedAt, avatarUrl }: AccountCardProps) {
  const router = useRouter();
  return (
    <Card className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-blue-950 text-blue-900 dark:text-white shadow-lg border-blue-200 dark:border-blue-800">
      <Avatar className="w-20 h-20 border-4 border-blue-400">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback>{name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : "U"}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-2">
        <div className="text-xl font-bold">{name}</div>
        <div className="text-sm text-blue-700 dark:text-blue-200">{email}</div>
        {jobTitle && <div className="text-sm text-blue-500 dark:text-blue-300">{jobTitle}</div>}
        {language && <div className="text-sm text-blue-500 dark:text-blue-300">Language: {language}</div>}
        <div className="mt-2">
          <span className="font-semibold">Package:</span> {subscription.type.charAt(0).toUpperCase() + subscription.type.slice(1)}
          <span className="ml-4 font-semibold">Status:</span> <span className={
            subscription.status === 'active' ? 'text-green-600' : subscription.status === 'expired' ? 'text-red-600' : 'text-yellow-600'
          }>{subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}</span>
        </div>
        <div className="text-sm mt-1">Messages Left: {subscription.remainingMessages} / {subscription.messageLimit}</div>
        <div className="text-sm mt-1">Start: {subscription.startDate} | End: {subscription.endDate}</div>
        <div className="text-sm mt-1">Trial Used: <span className={trialUsed ? 'text-red-600' : 'text-green-600'}>{trialUsed ? 'Yes' : 'No'}</span></div>
        <div className="text-sm mt-1">Created: {createdAt}</div>
        <div className="text-sm mt-1">Updated: {updatedAt}</div>
        <div className="mt-2 p-2 rounded bg-blue-100 dark:bg-blue-900">
          {subscription.type === 'trial' ? (
            (() => {
              const created = new Date(createdAt);
              const now = new Date();
              const trialEnd = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);
              const diffTime = trialEnd.getTime() - now.getTime();
              const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
              return (
                <div className="font-semibold text-blue-700 dark:text-blue-300">
                  Trial ends in: <span className="text-blue-600 dark:text-blue-200">{diffDays} day{diffDays !== 1 ? 's' : ''}</span>
                </div>
              );
            })()
          ) : (
            <>
              <div className="font-semibold mb-1">Payment Info</div>
              <div className="text-sm">Amount: ${subscription.payment.amount}</div>
              <div className="text-sm">Method: {subscription.payment.method}</div>
              <div className="text-sm">Last Payment: {subscription.payment.lastPaymentDate}</div>
              <div className="text-sm">Next Payment: {subscription.payment.nextPaymentDate}</div>
            </>
          )}
        </div>
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 dark:hover:bg-blue-900" onClick={() => router.push("/dashboard/account")}>Manage Account</Button>
    </Card>
  );
} 