import { Card } from "@/components/ui/card";
import React from "react";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface AccountHistoryProps {
  createdAt: string;
  updatedAt: string;
}

export default function AccountHistory({ createdAt, updatedAt }: AccountHistoryProps) {
  const { t } = useTranslation();
  return (
    <Card className="p-8 shadow-xl space-y-6">
      <h2 className="text-xl font-semibold text-blue-900 dark:text-white flex items-center gap-2 mb-4 text-rtl">
        <span role="img" aria-label="history">🕒</span> {t('account.accountHistory')}
      </h2>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-rtl">{t('dashboard.created')}: <span className="font-medium">{createdAt}</span></div>
        <div className="text-sm text-rtl">{t('dashboard.updated')}: <span className="font-medium">{updatedAt}</span></div>
      </div>
    </Card>
  );
} 