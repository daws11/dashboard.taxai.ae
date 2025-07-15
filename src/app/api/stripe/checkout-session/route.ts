import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { plans } from '@/app/dashboard/account/accountConstants';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { planKey, email } = await req.json();
    // Validasi email
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    // Cari plan dari accountConstants
    const plan = plans.find(p => p.key === planKey);
    if (!plan || !plan.price || plan.contact || plan.price === 'Free') {
      return NextResponse.json({ error: 'Invalid plan key' }, { status: 400 });
    }
    // Ambil nominal harga dari string, misal '$99' -> 9900 (dalam sen)
    const priceNumber = Number(plan.price.replace(/[^\d.]/g, ''));
    if (!priceNumber) {
      return NextResponse.json({ error: 'Invalid plan price' }, { status: 400 });
    }
    const amount = Math.round(priceNumber * 100); // Stripe expects amount in cents
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      customer_email: email,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/account?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/account?canceled=1`,
      metadata: { planKey },
    });
    return NextResponse.json({ sessionId: session.id });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 