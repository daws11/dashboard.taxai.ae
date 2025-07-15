import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import * as Accordion from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import React from "react";
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

// Tambahkan tipe Plan dan Subscription
type Plan = {
  key: string;
  name: string;
  price: string;
  priceAED?: string;
  description: string;
  features: string[];
  contact?: boolean;
};

type Subscription = {
  type?: string;
  email?: string;
} & Record<string, unknown>;

interface PlanDialogProps {
  planDialogOpen: boolean;
  setPlanDialogOpen: (v: boolean) => void;
  openPlan: string;
  setOpenPlan: (v: string) => void;
  plans: Plan[];
  subscription: Subscription;
  // onPlanChange: (planKey: string) => void; // Hapus karena tidak dipakai
}

export default function PlanDialog({
  planDialogOpen,
  setPlanDialogOpen,
  openPlan,
  setOpenPlan,
  plans,
  subscription,
}: PlanDialogProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  // Stripe publishable key dari env
  const stripePromise = typeof window !== 'undefined' ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!) : null;

  const handleStripeCheckout = async (planKey: string) => {
    if (!subscription?.email) {
      alert("Email tidak ditemukan. Silakan login ulang.");
      setLoadingPlan(null);
      return;
    }
    setLoadingPlan(planKey);
    try {
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey, email: subscription?.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create Stripe session');
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        alert('Stripe failed to load');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start checkout';
      alert(errorMessage);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Dialog open={planDialogOpen} onOpenChange={setPlanDialogOpen}>
      <DialogTrigger asChild>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow transition-all">Change Plan</button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="mb-4">Choose Your Plan</DialogTitle>
        </DialogHeader>
        <Accordion.Root type="single" collapsible className="w-full space-y-2" value={openPlan} onValueChange={setOpenPlan}>
          {plans.map((plan) => (
            <Accordion.Item key={plan.key} value={plan.key} className="border rounded-xl bg-white dark:bg-blue-950 shadow">
              <Accordion.Header>
                <Accordion.Trigger className="flex w-full justify-between items-center px-6 py-4 font-bold text-lg text-blue-900 dark:text-white focus:outline-none">
                  <span className="flex items-center gap-2">
                    {plan.name}
                    {(subscription?.type === plan.key || (plan.key === 'trial' && !subscription?.type)) && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded bg-blue-600 text-white">Active</span>
                    )}
                  </span>
                  <span className="text-blue-700 dark:text-blue-200 font-semibold">{plan.price}{plan.priceAED && <span className="text-base font-normal text-gray-500 dark:text-gray-300 ml-2">{plan.priceAED}</span>}</span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content asChild>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: openPlan === plan.key ? 'auto' : 0, opacity: openPlan === plan.key ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  style={{ pointerEvents: openPlan === plan.key ? 'auto' : 'none', visibility: openPlan === plan.key ? 'visible' : 'hidden' }}
                  className="overflow-hidden px-6 pb-4 pt-2 text-sm text-gray-700 dark:text-gray-200"
                >
                  <div className="mb-2 font-medium">{plan.description}</div>
                  <ul className="mb-4 space-y-1">
                    {plan.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-2"><span className="text-green-500">✔</span> {f}</li>
                    ))}
                  </ul>
                  {subscription?.type === plan.key || (plan.key === 'trial' && subscription?.type === undefined) ? (
                    <button className="px-4 py-2 bg-blue-200 text-blue-700 rounded-lg font-semibold cursor-default" disabled>Active</button>
                  ) : plan.contact ? (
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold" onClick={() => window.location.href = 'mailto:sales@taxai.ae'}>Contact Sales</button>
                  ) : (
                    <button
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold disabled:opacity-60"
                      onClick={() => handleStripeCheckout(plan.key)}
                      disabled={loadingPlan === plan.key}
                    >
                      {loadingPlan === plan.key ? 'Processing...' : 'Change'}
                    </button>
                  )}
                </motion.div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
        <DialogClose asChild>
          <button className="mt-6 px-4 py-2 bg-gray-200 dark:bg-blue-800 text-gray-800 dark:text-white rounded-lg font-semibold">Close</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
} 