
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { initializeApp, getApps, App, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

const db = getFirestore();

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    console.error('PAYSTACK_SECRET_KEY is not set.');
    return new NextResponse('Server configuration error.', { status: 500 });
  }

  const text = await req.text();
  const hash = crypto.createHmac('sha512', secret).update(text).digest('hex');
  
  const signature = req.headers.get('x-paystack-signature');
  if (hash !== signature) {
    return new NextResponse('Invalid signature.', { status: 401 });
  }
  
  const event = JSON.parse(text);

  if (event.event === 'charge.success') {
    const { data } = event;
    const { amount, reference } = data;
    const depositAmount = amount / 100; // Paystack sends amount in pesewas/kobo
    const userId = data.metadata?.user_id;

    if (!userId) {
      console.warn(`Webhook received for reference ${reference} without a user_id in metadata.`);
      // We still return 200 so Paystack doesn't retry, but we log the issue.
      return new NextResponse('Success, but no user ID found.', { status: 200 });
    }

    try {
      const userRef = db.collection('users').doc(userId);
      const transactionRef = db.collection(`users/${userId}/transactions`).doc();

      // Use a Firestore transaction to ensure atomicity
      await db.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        if (!userDoc.exists) {
          throw new Error(`User with ID ${userId} not found.`);
        }
        const currentBalance = userDoc.data()?.balance || 0;
        const newBalance = currentBalance + depositAmount;

        // 1. Update user's balance
        t.update(userRef, {
          balance: FieldValue.increment(depositAmount),
        });

        // 2. Create a transaction record
        t.set(transactionRef, {
          userId: userId,
          type: 'Deposit',
          amount: depositAmount,
          balanceAfter: newBalance,
          description: `Deposit via Paystack. Ref: ${reference}`,
          createdAt: FieldValue.serverTimestamp(),
        });
      });

    } catch (error: any) {
      console.error(`Error processing webhook for reference ${reference}:`, error.message);
      // Return 500 to signal to Paystack to retry
      return new NextResponse(`Webhook Error: ${error.message}`, { status: 500 });
    }
  }

  return new NextResponse('Webhook received.', { status: 200 });
}
