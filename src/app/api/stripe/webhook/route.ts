import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import db from '@/app/api/_utils/db';
import User from '@/app/api/_models/User';
import { plans } from '@/app/dashboard/account/accountConstants';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  let event: Stripe.Event;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    // DEVELOPMENT MODE: skip signature verification
    console.warn('WARNING: STRIPE_WEBHOOK_SECRET not set, skipping signature verification!');
    const body = await req.json();
    event = body;
  } else {
    const rawBody = await req.text();
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig!,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Webhook signature verification failed.';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;
    const planKey = session.metadata?.planKey || '';
    const plan = plans.find(p => p.key === planKey);
    if (!plan || !email) {
      return NextResponse.json({ error: 'Plan or email not found' }, { status: 400 });
    }
    await db;
    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          subscription: {
            type: plan.key,
            status: 'active',
            messageLimit: getMessageLimit(plan.key),
            remainingMessages: getMessageLimit(plan.key),
            startDate: new Date(),
            endDate: getEndDate(plan.key),
            payment: {
              amount: getPlanAmount(plan.key),
              method: 'Stripe',
              lastPaymentDate: new Date(),
              nextPaymentDate: getEndDate(plan.key),
            }
          }
        }
      }
    );
  }
  return NextResponse.json({ received: true });
}

function getMessageLimit(planKey: string) {
  switch (planKey) {
    case 'monthly': return 100;
    case 'quarterly': return 300;
    case 'yearly': return 1200;
    default: return 30;
  }
}
function getEndDate(planKey: string) {
  const now = new Date();
  switch (planKey) {
    case 'monthly': return new Date(now.setMonth(now.getMonth() + 1));
    case 'quarterly': return new Date(now.setMonth(now.getMonth() + 3));
    case 'yearly': return new Date(now.setFullYear(now.getFullYear() + 1));
    default: return new Date(now.setDate(now.getDate() + 14));
  }
}
function getPlanAmount(planKey: string) {
  switch (planKey) {
    case 'monthly': return 99;
    case 'quarterly': return 250;
    case 'yearly': return 899;
    default: return 0;
  }
} 