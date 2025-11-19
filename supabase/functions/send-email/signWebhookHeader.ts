import type { Webhook } from 'standardwebhooks';

/**
 * Signs the webhook headers. Why? Because for some reason Supabase doesn't
 * sign the webhook headers when running locally... 🤷‍♂️
 *
 * USE THIS ONLY FOR LOCAL DEVELOPMENT!
 *
 * @param webhook The Webhook instance.
 * @param headers The request headers.
 * @param payload The request payload.
 * @returns The signed headers.
 */
export function signWebhookHeader(
  webhook: Webhook,
  headers: {
    [k: string]: string;
  },
  payload: string,
): {
  [k: string]: string;
} {
  const newDate = new Date();
  const whId = 'webhook_id';
  const signature = webhook.sign(whId, newDate, payload);

  headers['webhook-id'] = whId;
  headers['webhook-signature'] = signature;
  headers['webhook-timestamp'] = `${Math.floor(newDate.getTime() / 1000)}`;

  return headers;
}
