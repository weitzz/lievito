import Stripe from 'stripe'
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
//const stripe = await loadStripe(process.env.STRIPE_SECRET_KEY);
