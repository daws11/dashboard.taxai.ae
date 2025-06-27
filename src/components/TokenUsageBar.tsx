interface TokenUsageBarProps {
  used: number;
  limit: number;
}

export function TokenUsageBar({ used, limit }: TokenUsageBarProps) {
  const percent = Math.min(100, Math.round((used / limit) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-xs text-blue-900 dark:text-blue-200">
        <span>Tokens Used</span>
        <span>{used} / {limit}</span>
      </div>
      <div className="w-full bg-blue-100 dark:bg-blue-950 rounded-full h-3">
        <div
          className="h-3 rounded-full bg-blue-600 dark:bg-blue-400 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
} 