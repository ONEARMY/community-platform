import Keyv from 'keyv';

// Short-lived, single-use ticket that lets the post-payment "thank you" flow
// (ThankYouAccountForm/ThankYouLoginForm) hand off to a real signed-in session
// without ever transmitting a password to api.stripe.sign-in.ts. Only issued
// after create-account/set-password/link-account has already independently
// verified the user (Stripe payment + Admin API / password check), so
// redeeming a ticket there is not a general-purpose login bypass.
const TICKET_TTL_MS = 60_000;

const tickets = new Keyv<{ email: string }>({ ttl: TICKET_TTL_MS });

export const issueSignInTicket = async (email: string): Promise<string> => {
  const ticket = crypto.randomUUID();
  await tickets.set(ticket, { email });
  return ticket;
};

export const redeemSignInTicket = async (ticket: string): Promise<string | null> => {
  const record = await tickets.get(ticket);
  if (!record) {
    return null;
  }

  await tickets.delete(ticket);
  return record.email;
};
