import { Card } from "@/components/ui/card";
import React from "react";

interface AccountHistoryProps {
  createdAt: string;
  updatedAt: string;
}

export default function AccountHistory({ createdAt, updatedAt }: AccountHistoryProps) {
  return (
    <Card className="p-8 shadow-xl space-y-6">
      <h2 className="text-xl font-semibold text-blue-900 dark:text-white flex items-center gap-2 mb-4">
        <span role="img" aria-label="history">🕒</span> Account History
      </h2>
      <div className="flex flex-col gap-2">
        <div className="text-sm">Created At: <span className="font-medium">{createdAt}</span></div>
        <div className="text-sm">Updated At: <span className="font-medium">{updatedAt}</span></div>
      </div>
    </Card>
  );
} 