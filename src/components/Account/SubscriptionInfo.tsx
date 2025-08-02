import { Card } from "@/components/ui/card";
import React from "react";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface SubscriptionInfoProps {
  subscription: unknown;
  trialUsed: boolean;
  createdAt: string;
  PlanDialog: React.ReactNode;
  trialExpired?: boolean;
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
  trialExpired,
}: SubscriptionInfoProps) {
  const { t } = useTranslation();
  const sub = isSubscription(subscription) ? subscription : {};
  return (
    <Card className="p-8 shadow-xl space-y-6">
      <h2 className="text-xl font-semibold text-blue-900 dark:text-white flex items-center gap-2 mb-4 text-rtl">
        <span role="img" aria-label="subscription">💳</span> {t('subscription.subscriptionInfo')} & {t('subscription.paymentInformation')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="text-sm text-rtl">{t('subscription.subscriptionType')}: <span className="font-medium">{sub?.type ? sub.type.charAt(0).toUpperCase() + sub.type.slice(1) : '-'}</span></div>
          <div className="text-sm text-rtl">{t('subscription.subscriptionStatus')}: <span className={`font-medium ${trialExpired ? 'text-red-600' : sub?.status === 'active' ? 'text-green-600' : sub?.status === 'expired' ? 'text-red-600' : 'text-yellow-600'}`}>{trialExpired ? t('dashboard.expired') : (sub?.status ? sub.status.charAt(0).toUpperCase() + sub.status.slice(1) : '-')}</span></div>
          <div className="text-sm text-rtl">{t('subscription.messageLimit')}: {sub?.messageLimit ?? '-'}</div>
          <div className="text-sm text-rtl">{t('subscription.remainingMessages')}: {sub?.remainingMessages ?? '-'}</div>
          <div className="text-sm text-rtl">{t('subscription.startDate')}: {sub?.startDate ? new Date(sub.startDate).toISOString().slice(0, 10) : '-'}</div>
          <div className="text-sm text-rtl">{t('subscription.endDate')}: {sub?.endDate ? new Date(sub.endDate).toISOString().slice(0, 10) : '-'}</div>
          <div className="text-sm text-rtl">{t('dashboard.trialUsed')}: <span className={trialUsed ? 'text-red-600' : 'text-green-600'}>{trialUsed ? t('common.yes') : t('common.no')}</span></div>
          {PlanDialog}
        </div>
        <div>
          <div className="font-semibold mb-1 flex items-center gap-2 text-rtl"><span role="img" aria-label="payment">💰</span> {t('subscription.paymentInformation')}</div>
          {trialExpired && (
            <div className="mb-2 p-3 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 flex flex-col md:flex-row items-center gap-3 text-sm">
              <span className="flex items-center"><svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><circle cx="12" cy="16" r="1" /></svg></span>
              <span className="flex-1 font-semibold text-rtl">{t('dashboard.trialExpiredMessage')}</span>
              <button
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition-all text-sm"
                onClick={() => window.location.href = '/dashboard/account?tab=Subscription'}
              >{t('dashboard.upgradePlan')}</button>
            </div>
          )}
          {sub?.type === 'trial' && !trialExpired ? (
            (() => {
              const created = new Date(createdAt);
              const now = new Date();
              const trialEnd = new Date(created.getTime() + 14 * 24 * 60 * 60 * 1000);
              const diffTime = trialEnd.getTime() - now.getTime();
              const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
              return (
                <div className="font-semibold text-blue-700 dark:text-blue-300 text-rtl">
                  {t('dashboard.trialEndsIn')}: <span className="text-blue-600 dark:text-blue-200">{diffDays} {diffDays === 1 ? t('dashboard.days') : t('dashboard.days_plural')}</span>
                </div>
              );
            })()
          ) : sub?.type !== 'trial' ? (
            <>
              <div className="text-sm text-rtl">{t('dashboard.amount')}: <span className="font-medium">{sub?.payment?.amount ? `$${sub.payment.amount}` : '-'}</span></div>
              <div className="text-sm text-rtl">{t('dashboard.method')}: {sub?.payment?.method ?? '-'}</div>
              <div className="text-sm text-rtl">{t('dashboard.lastPayment')}: {sub?.payment?.lastPaymentDate ? new Date(sub.payment.lastPaymentDate).toISOString().slice(0, 10) : '-'}</div>
              <div className="text-sm text-rtl">{t('dashboard.nextPayment')}: {sub?.payment?.nextPaymentDate ? new Date(sub.payment.nextPaymentDate).toISOString().slice(0, 10) : '-'}</div>
            </>
          ) : null}
        </div>
      </div>
    </Card>
  );
} 