import { Card } from "@/components/ui/card";
import React from "react";

interface SubscriptionInfoProps {
  subscription: unknown;
  trialUsed: boolean;
  createdAt: string;
  PlanDialog: React.ReactNode;
}

function isSubscription(obj: unknown): obj is {
  type?: string;
  status?: string;
  messageLimit?: number;
  remainingMessages?: number;
  startDate?: string;
  endDate?: string;
  payment?: {
    amount?: number;
    method?: string;
    lastPaymentDate?: string;
    nextPaymentDate?: string;
  };
} {
  return typeof obj === 'object' && obj !== null;
}

export default function SubscriptionInfo({
  subscription,
  trialUsed,
  createdAt,
  PlanDialog,
}: SubscriptionInfoProps) {
  const sub = isSubscription(subscription) ? subscription : {};
  return (
    <Card className="p-8 shadow-xl space-y-6">
      <h2 className="text-xl font-semibold text-blue-900 dark:text-white flex items-center gap-2 mb-4">
        <span role="img" aria-label="subscription">💳</span> Subscription & Payment
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-sm">Type: <span className="font-medium">{sub?.type ? sub.type.charAt(0).toUpperCase() + sub.type.slice(1) : '-'}</span></div>
          <div className="text-sm">Status: <span className={`font-medium ${sub?.status === 'active' ? 'text-green-600' : sub?.status === 'expired' ? 'text-red-600' : 'text-yellow-600'}`}>{sub?.status ? sub.status.charAt(0).toUpperCase() + sub.status.slice(1) : '-'}</span></div>
          <div className="text-sm">Message Limit: {sub?.messageLimit ?? '-'}</div>
          <div className="text-sm">Remaining Messages: {sub?.remainingMessages ?? '-'}</div>
          <div className="text-sm">Start Date: {sub?.startDate ? new Date(sub.startDate).toISOString().slice(0, 10) : '-'}</div>
          <div className="text-sm">End Date: {sub?.endDate ? new Date(sub.endDate).toISOString().slice(0, 10) : '-'}</div>
          <div className="text-sm">Trial Used: <span className={trialUsed ? 'text-red-600' : 'text-green-600'}>{trialUsed ? 'Yes' : 'No'}</span></div>
          {PlanDialog}
        </div>
        <div className="bg-blue-100 dark:bg-blue-900 rounded p-4 space-y-2">
          <div className="font-semibold mb-1 flex items-center gap-2"><span role="img" aria-label="payment">💰</span> Payment Info</div>
          {sub?.type === 'trial' ? (
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
              <div className="text-sm">Amount: <span className="font-medium">{sub?.payment?.amount ? `$${sub.payment.amount}` : '-'}</span></div>
              <div className="text-sm">Method: {sub?.payment?.method ?? '-'}</div>
              <div className="text-sm">Last Payment: {sub?.payment?.lastPaymentDate ? new Date(sub.payment.lastPaymentDate).toISOString().slice(0, 10) : '-'}</div>
              <div className="text-sm">Next Payment: {sub?.payment?.nextPaymentDate ? new Date(sub.payment.nextPaymentDate).toISOString().slice(0, 10) : '-'}</div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
} 