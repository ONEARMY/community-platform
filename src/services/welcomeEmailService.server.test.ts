import type { SupabaseClient } from '@supabase/supabase-js';
import { render } from 'react-email';
import { sendEmail } from 'src/.server/resend';
import type Stripe from 'stripe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { StripeServiceServer } from './stripeService.server';
import { TenantSettingsService } from './tenantSettingsService.server';
import { sendMembershipWelcomeEmail, sendWelcomeEmail } from './welcomeEmailService.server';

vi.mock('src/.server/resend');
vi.mock('./tenantSettingsService.server');

const CONTENT = {
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Hi {name}, thanks!' }] }],
};

const SETTINGS = {
  siteName: 'Precious Plastic',
  siteUrl: 'https://community.preciousplastic.com',
  siteImage: 'https://community.preciousplastic.com/logo.png',
  messageSignOff: 'One Army',
  emailFrom: 'hello@onearmy.earth',
};

const WELCOME_EMAIL = { fromName: 'Dave', subject: 'Welcome, {name}', content: CONTENT };

const client = {} as SupabaseClient;
const SITE_URL = 'https://community.preciousplastic.com';

const setup = (welcomeEmail: object = WELCOME_EMAIL, sendError?: string) => {
  (TenantSettingsService as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      get: vi.fn().mockResolvedValue(SETTINGS),
      getWelcomeEmail: vi.fn().mockResolvedValue(welcomeEmail),
    };
  });
  (sendEmail as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ error: sendError });
};

const sent = () => (sendEmail as unknown as ReturnType<typeof vi.fn>).mock.calls;

describe('sendWelcomeEmail', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sends nothing when no welcome email is set', async () => {
    setup({ ...WELCOME_EMAIL, content: null });

    const result = await sendWelcomeEmail({ client, to: 'a@b.com', name: 'Ana', siteUrl: SITE_URL });

    expect(result).toBe(false);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('fills in the name and uses the configured from name', async () => {
    setup();

    await sendWelcomeEmail({
      client,
      to: 'a@b.com',
      name: 'Ana',
      siteUrl: SITE_URL,
      idempotencyKey: 'welcome-email/in_1',
    });

    const payload = sent()[0][0];
    expect(payload.from).toBe('Dave <hello@onearmy.earth>');
    expect(payload.subject).toBe('Welcome, Ana');
    expect(payload.idempotencyKey).toBe('welcome-email/in_1');
    expect(await render(payload.emailTemplate)).toContain('Hi Ana, thanks!');
  });

  it('greets someone without a name as "there"', async () => {
    setup();

    await sendWelcomeEmail({ client, to: 'a@b.com', name: null, siteUrl: SITE_URL });

    expect(sent()[0][0].subject).toBe('Welcome, there');
  });

  it('keeps the from name from breaking the header and falls back to the sign off', async () => {
    setup({ ...WELCOME_EMAIL, fromName: 'Evil <x@y.com>\r\nBcc: z' });
    await sendWelcomeEmail({ client, to: 'a@b.com', name: 'Ana', siteUrl: SITE_URL });
    expect(sent()[0][0].from).toMatch(/^[^<>"\r\n]+ <hello@onearmy\.earth>$/);

    setup({ ...WELCOME_EMAIL, fromName: null });
    await sendWelcomeEmail({ client, to: 'a@b.com', name: 'Ana', siteUrl: SITE_URL });
    expect(sent()[1][0].from).toBe('One Army <hello@onearmy.earth>');
  });

  it('sends a draft instead of the saved email', async () => {
    setup();

    await sendWelcomeEmail({
      client,
      to: 'a@b.com',
      name: 'Ana',
      siteUrl: SITE_URL,
      draft: { fromName: null, subject: 'Draft', content: CONTENT },
    });

    expect(sent()[0][0].subject).toBe('Draft');
  });

  it('throws when the email fails to send', async () => {
    setup(WELCOME_EMAIL, 'rate limited');

    await expect(
      sendWelcomeEmail({ client, to: 'a@b.com', name: 'Ana', siteUrl: SITE_URL }),
    ).rejects.toThrow('rate limited');
  });
});

describe('sendMembershipWelcomeEmail', () => {
  const stripeService = {
    getProfileIdentityByStripeCustomerId: vi.fn(),
  } as unknown as StripeServiceServer;

  const invoiceEvent = (billingReason: string, type = 'invoice.payment_succeeded') =>
    ({
      type,
      data: { object: { id: 'in_1', customer: 'cus_1', billing_reason: billingReason } },
    }) as unknown as Stripe.Event;

  const welcome = (event: Stripe.Event) =>
    sendMembershipWelcomeEmail(event, stripeService, client, 'precious-plastic', SITE_URL);

  beforeEach(() => {
    vi.clearAllMocks();
    setup();
    vi.spyOn(StripeServiceServer, 'getStripeCustomer').mockResolvedValue({
      id: 'cus_1',
      email: 'ana@example.com',
      name: 'Ana Stripe',
    });
    vi.mocked(stripeService.getProfileIdentityByStripeCustomerId).mockResolvedValue(null);
  });

  afterEach(() => vi.restoreAllMocks());

  it('welcomes a new member at their Stripe email, keyed to the invoice', async () => {
    await welcome(invoiceEvent('subscription_create'));

    const payload = sent()[0][0];
    expect(payload.to).toBe('ana@example.com');
    expect(payload.subject).toBe('Welcome, Ana Stripe');
    expect(payload.idempotencyKey).toBe('welcome-email/in_1');
  });

  it('prefers the profile display name', async () => {
    vi.mocked(stripeService.getProfileIdentityByStripeCustomerId).mockResolvedValue({
      id: 1,
      displayName: 'ana_p',
    });

    await welcome(invoiceEvent('subscription_create'));

    expect(sent()[0][0].subject).toBe('Welcome, ana_p');
  });

  it.each([
    ['a renewal', invoiceEvent('subscription_cycle')],
    ['a tier change', invoiceEvent('subscription_update')],
    ['a failed payment', invoiceEvent('subscription_create', 'invoice.payment_failed')],
  ])('ignores %s', async (_, event) => {
    await welcome(event);

    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('skips a customer without an email', async () => {
    vi.spyOn(StripeServiceServer, 'getStripeCustomer').mockResolvedValue(null);

    await welcome(invoiceEvent('subscription_create'));

    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('never throws, so the webhook still succeeds', async () => {
    setup(WELCOME_EMAIL, 'rate limited');

    await expect(welcome(invoiceEvent('subscription_create'))).resolves.toBeUndefined();
  });
});
