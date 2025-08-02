import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { useTranslation } from "@/lib/hooks/useTranslation";

interface ProfileFormProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  jobTitle: string;
  setJobTitle: (v: string) => void;
  language: string;
  setLanguage: (v: string) => void;
  jobTitles: { value: string; label: string }[];
  languages: { value: string; label: string }[];
  loading: boolean;
  message: string;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: () => void;
}

export default function ProfileForm({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  jobTitle,
  setJobTitle,
  language,
  setLanguage,
  jobTitles,
  languages,
  loading,
  message,
  onSubmit,
  onDelete,
}: ProfileFormProps) {
  const { t } = useTranslation();
  return (
    <form className="space-y-6 layout-preserve" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 layout-preserve">
        <div>
          <label htmlFor="name" className="block text-blue-900 dark:text-blue-200 mb-1">{t('account.name')}</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-blue-900 dark:text-blue-200 mb-1">{t('auth.email')}</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-blue-900 dark:text-blue-200 mb-1">{t('account.newPassword')}</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t('account.leaveBlankPassword')}
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="jobTitle" className="block text-blue-900 dark:text-blue-200 mb-1">{t('account.jobTitle')}</label>
          <select
            id="jobTitle"
            value={jobTitle || jobTitles[0].value}
            onChange={e => setJobTitle(e.target.value)}
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white rounded-md h-9 w-full px-3"
          >
            {!jobTitle && <option value="">{t('account.selectJobTitle')}</option>}
            {jobTitles.map(j => (
              <option key={j.value} value={j.value}>{j.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block text-blue-900 dark:text-blue-200 mb-1">{t('account.language')}</label>
          <select
            id="language"
            value={language || languages[0].value}
            onChange={e => setLanguage(e.target.value)}
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white rounded-md h-9 w-full px-3"
          >
            {!language && <option value="">{t('account.selectLanguage')}</option>}
            {languages.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 dark:hover:bg-blue-900 w-full" disabled={loading}>
        {loading ? t('account.updating') : t('account.updateProfile')}
      </Button>
      {message && <div className="text-center text-sm mt-2 text-blue-700 dark:text-blue-200">{message}</div>}
      <Button variant="destructive" className="w-full mt-4" onClick={onDelete} disabled={loading}>
        {loading ? t('account.processing') : t('account.deleteAccount')}
      </Button>
    </form>
  );
} 