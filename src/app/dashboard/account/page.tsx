"use client";
import { useState, useEffect } from "react";
import ProfileForm from "@/components/Account/ProfileForm";
import SubscriptionInfo from "@/components/Account/SubscriptionInfo";
import AccountHistory from "@/components/Account/AccountHistory";
import PlanDialog from "@/components/Account/PlanDialog";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { TABS, JOB_TITLES, LANGUAGES, plans } from "./accountConstants";
import { normalizeLanguage } from "./accountUtils";

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

export default function AccountManagement() {
  const searchParams = useSearchParams();
  const initialTab = (() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam && TABS.includes(tabParam)) return tabParam;
    return "Profile";
  })();
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState(mockUser.email);
  const [password, setPassword] = useState("");
  const [jobTitle, setJobTitle] = useState(mockUser.jobTitle);
  const [language, setLanguage] = useState(mockUser.language);
  const [name, setName] = useState(mockUser.name);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [subscription, setSubscription] = useState(mockUser.subscription);
  const [trialUsed, setTrialUsed] = useState(mockUser.trialUsed);
  const [createdAt, setCreatedAt] = useState(mockUser.createdAt);
  const [updatedAt, setUpdatedAt] = useState(mockUser.updatedAt);
  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [openPlan, setOpenPlan] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("/api/users/me");
      if (res.ok) {
        const user = await res.json();
        setName(user.name || "");
        setEmail(user.email || "");
        setJobTitle(user.jobTitle || "");
        setLanguage(normalizeLanguage(user.language || ""));
        setSubscription(user.subscription || {});
        setTrialUsed(user.trialUsed || false);
        setCreatedAt(user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : "");
        setUpdatedAt(user.updatedAt ? new Date(user.updatedAt).toISOString().slice(0, 10) : "");
      }
    }
    fetchUser();
  }, []);

  // Sync tab state if URL changes (e.g. user navigates back/forward)
  useEffect(() => {
    const tabParam = searchParams?.get("tab");
    if (tabParam && TABS.includes(tabParam) && tabParam !== tab) {
      setTab(tabParam);
    }
  }, [searchParams, tab]);

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

  function handlePlanChange() {
    // TODO: implementasi perubahan plan
    // setSubscription(...)
    setPlanDialogOpen(false);
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
              <ProfileForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                jobTitle={jobTitle}
                setJobTitle={setJobTitle}
                language={language}
                setLanguage={setLanguage}
                jobTitles={JOB_TITLES}
                languages={LANGUAGES}
                loading={loading}
                message={message}
                onSubmit={handleUpdate}
                onDelete={handleDelete}
              />
            </Card>
          )}
          {tab === "Subscription" && (
            <SubscriptionInfo
              subscription={subscription}
              trialUsed={trialUsed}
              createdAt={createdAt}
              PlanDialog={
                <PlanDialog
                  planDialogOpen={planDialogOpen}
                  setPlanDialogOpen={setPlanDialogOpen}
                  openPlan={openPlan}
                  setOpenPlan={setOpenPlan}
                  plans={plans}
                  subscription={subscription}
                  onPlanChange={handlePlanChange}
                />
              }
            />
          )}
          {tab === "Account History" && (
            <AccountHistory createdAt={createdAt} updatedAt={updatedAt} />
          )}
        </div>
      </div>
    </main>
  );
} 