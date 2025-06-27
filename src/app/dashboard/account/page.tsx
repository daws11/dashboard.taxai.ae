"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

const mockUser = {
  name: "Budi Santoso",
  email: "budi@example.com",
  jobTitle: "Accountant",
  language: "English",
  subscription: {
    type: 'monthly',
    status: 'active',
    messageLimit: 300,
    remainingMessages: 120,
    startDate: "2024-05-01",
    endDate: "2024-06-01",
    payment: {
      amount: 10,
      method: "Credit Card",
      lastPaymentDate: "2024-05-01",
      nextPaymentDate: "2024-06-01"
    }
  },
  trialUsed: false,
  createdAt: "2024-01-01",
  updatedAt: "2024-05-10",
};

const TABS = ["Profile", "Subscription", "Account History"];

const JOB_TITLES = [
  { value: "tax agent", label: "Tax Agent" },
  { value: "business owner", label: "Business Owner" },
  { value: "finance", label: "Finance" },
];

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "arabic", label: "العربية" },
  { value: "chinese", label: "中文" },
];

function normalizeLanguage(val: string) {
  if (!val) return "";
  const lower = val.toLowerCase();
  if (["english", "en", "eng", "english"].includes(lower) || val === "English") return "english";
  if (["arabic", "ar", "arab", "العربية"].includes(lower) || val === "العربية") return "arabic";
  if (["chinese", "zh", "中文"].includes(lower) || val === "中文") return "chinese";
  return lower;
}

export default function AccountManagement() {
  const [tab, setTab] = useState("Profile");
  const [email, setEmail] = useState(mockUser.email);
  const [password, setPassword] = useState("");
  const [jobTitle, setJobTitle] = useState(mockUser.jobTitle);
  const [language, setLanguage] = useState(mockUser.language);
  const [name, setName] = useState(mockUser.name);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/users/me");
      if (res.ok) {
        const user = await res.json();
        setName(user.name || "");
        setEmail(user.email || "");
        setJobTitle(user.jobTitle || "");
        setLanguage(normalizeLanguage(user.language || ""));
      }
    }
    fetchUser();
  }, []);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: password || undefined, jobTitle, language: normalizeLanguage(language) }),
      });
      if (res.ok) {
        setMessage("Profile updated successfully.");
        await signIn("credentials", { email, password: password || undefined, redirect: false });
        const session = await getSession();
        if (((session as unknown) as Record<string, unknown>)?.accessToken) {
          const expiry = Date.now() + 60 * 60 * 1000; // 1 jam
          localStorage.setItem("accessToken", ((session as unknown) as Record<string, string>).accessToken as string);
          localStorage.setItem("accessTokenExpiry", expiry.toString());
        }
      } else {
        const err = await res.text();
        setMessage("Update failed: " + err);
      }
    } catch (err) {
      setMessage("Update failed: " + err);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/users/me", { method: "DELETE" });
      if (res.status === 204) {
        router.push("/");
      } else {
        const err = await res.text();
        setMessage("Delete failed: " + err);
      }
    } catch (err) {
      setMessage("Delete failed: " + err);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-blue-50 dark:bg-blue-950 py-8 px-4 md:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-blue-900 dark:text-white mb-4">Account Management</h1>
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {TABS.map((t) => (
            <button
              key={t}
              className={`px-4 py-2 rounded-t font-medium transition-colors border-b-2 ${tab === t ? 'bg-white dark:bg-blue-900 border-blue-600 text-blue-900 dark:text-white' : 'bg-blue-100 dark:bg-blue-950 border-transparent text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Tab Content */}
        <div>
          {tab === "Profile" && (
            <Card className="p-8 shadow-xl space-y-6">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-white flex items-center gap-2 mb-4">
                <span role="img" aria-label="profile">👤</span> Profile Information
              </h2>
              <form className="space-y-6" onSubmit={handleUpdate}>
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
                      value={jobTitle || JOB_TITLES[0].value}
                      onChange={e => setJobTitle(e.target.value)}
                      className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white rounded-md h-9 w-full px-3"
                    >
                      {!jobTitle && <option value="">Select job title</option>}
                      {JOB_TITLES.map(j => (
                        <option key={j.value} value={j.value}>{j.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="language" className="block text-blue-900 dark:text-blue-200 mb-1">Language</label>
                    <select
                      id="language"
                      value={language || LANGUAGES[0].value}
                      onChange={e => setLanguage(e.target.value)}
                      className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-white rounded-md h-9 w-full px-3"
                    >
                      {!language && <option value="">Select language</option>}
                      {LANGUAGES.map(l => (
                        <option key={l.value} value={l.value}>{l.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-800 dark:hover:bg-blue-900 w-full" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
                {message && <div className="text-center text-sm mt-2 text-blue-700 dark:text-blue-200">{message}</div>}
              </form>
              <Button variant="destructive" className="w-full mt-4" onClick={handleDelete} disabled={loading}>
                {loading ? "Processing..." : "Delete Account"}
              </Button>
            </Card>
          )}
          {tab === "Subscription" && (
            <Card className="p-8 shadow-xl space-y-6">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-white flex items-center gap-2 mb-4">
                <span role="img" aria-label="subscription">💳</span> Subscription & Payment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-sm">Type: <span className="font-medium">{mockUser.subscription.type.charAt(0).toUpperCase() + mockUser.subscription.type.slice(1)}</span></div>
                  <div className="text-sm">Status: <span className={`font-medium ${mockUser.subscription.status === 'active' ? 'text-green-600' : mockUser.subscription.status === 'expired' ? 'text-red-600' : 'text-yellow-600'}`}>{mockUser.subscription.status.charAt(0).toUpperCase() + mockUser.subscription.status.slice(1)}</span></div>
                  <div className="text-sm">Message Limit: {mockUser.subscription.messageLimit}</div>
                  <div className="text-sm">Remaining Messages: {mockUser.subscription.remainingMessages}</div>
                  <div className="text-sm">Start Date: {mockUser.subscription.startDate}</div>
                  <div className="text-sm">End Date: {mockUser.subscription.endDate}</div>
                  <div className="text-sm">Trial Used: <span className={mockUser.trialUsed ? 'text-red-600' : 'text-green-600'}>{mockUser.trialUsed ? 'Yes' : 'No'}</span></div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 rounded p-4 space-y-2">
                  <div className="font-semibold mb-1 flex items-center gap-2"><span role="img" aria-label="payment">💰</span> Payment Info</div>
                  <div className="text-sm">Amount: <span className="font-medium">${mockUser.subscription.payment.amount}</span></div>
                  <div className="text-sm">Method: {mockUser.subscription.payment.method}</div>
                  <div className="text-sm">Last Payment: {mockUser.subscription.payment.lastPaymentDate}</div>
                  <div className="text-sm">Next Payment: {mockUser.subscription.payment.nextPaymentDate}</div>
                </div>
              </div>
            </Card>
          )}
          {tab === "Account History" && (
            <Card className="p-8 shadow-xl space-y-6">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-white flex items-center gap-2 mb-4">
                <span role="img" aria-label="history">🕒</span> Account History
              </h2>
              <div className="flex flex-col gap-2">
                <div className="text-sm">Created At: <span className="font-medium">{mockUser.createdAt}</span></div>
                <div className="text-sm">Updated At: <span className="font-medium">{mockUser.updatedAt}</span></div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
} 