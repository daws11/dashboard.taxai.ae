import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

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
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-blue-900 dark:text-blue-200 mb-1">Name</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-blue-900 dark:text-blue-200 mb-1">Email</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-blue-900 dark:text-blue-200 mb-1">New Password</label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white"
          />
        </div>
        <div>
          <label htmlFor="jobTitle" className="block text-blue-900 dark:text-blue-200 mb-1">Job Title</label>
          <select
            id="jobTitle"
            value={jobTitle || jobTitles[0].value}
            onChange={e => setJobTitle(e.target.value)}
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white rounded-md h-9 w-full px-3"
          >
            {!jobTitle && <option value="">Select job title</option>}
            {jobTitles.map(j => (
              <option key={j.value} value={j.value}>{j.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="language" className="block text-blue-900 dark:text-blue-200 mb-1">Language</label>
          <select
            id="language"
            value={language || languages[0].value}
            onChange={e => setLanguage(e.target.value)}
            className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white rounded-md h-9 w-full px-3"
          >
            {!language && <option value="">Select language</option>}
            {languages.map(l => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        </div>
      </div>
      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 dark:hover:bg-blue-900 w-full" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </Button>
      {message && <div className="text-center text-sm mt-2 text-blue-700 dark:text-blue-200">{message}</div>}
      <Button variant="destructive" className="w-full mt-4" onClick={onDelete} disabled={loading}>
        {loading ? "Processing..." : "Delete Account"}
      </Button>
    </form>
  );
} 