/**
 * Payment service (mock).
 *
 * Production flow this mirrors:
 *  1. Client asks the server to create an order for a milestone, sending an idempotency key.
 *  2. Customer approves in their UPI app / card flow at the licensed payment partner.
 *  3. Partner calls our signed webhook. The server verifies the signature and marks the
 *     payment successful. The client only polls that server-side status.
 *
 * A project is never marked paid from a client-side callback. Swap `payMilestone`
 * for a real API call; the UI already waits on a server-confirmed result.
 */

export type PaymentMethod = 'upi' | 'card' | 'netbanking'

export interface PaymentRequest {
  projectRef: string
  milestoneId: string
  amount: number
  method: PaymentMethod
  idempotencyKey: string
}

export interface PaymentConfirmation {
  status: 'successful'
  paymentId: string
  utr: string
  amount: number
  idempotencyKey: string
}

export function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'idem_' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

const confirmed = new Map<string, PaymentConfirmation>()

const randomRef = (len: number, alphabet: string) =>
  Array.from({ length: len }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')

export async function payMilestone(req: PaymentRequest): Promise<PaymentConfirmation> {
  // Retrying with the same key returns the original result instead of charging twice.
  const existing = confirmed.get(req.idempotencyKey)
  if (existing) return existing

  await new Promise((resolve) => setTimeout(resolve, 2200))

  const result: PaymentConfirmation = {
    status: 'successful',
    paymentId: 'pay_' + randomRef(14, 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'),
    utr: randomRef(12, '0123456789'),
    amount: req.amount,
    idempotencyKey: req.idempotencyKey,
  }
  confirmed.set(req.idempotencyKey, result)
  return result
}
