import type { SupabaseClient } from '@supabase/supabase-js';
import { sendEmail } from 'src/.server/resend';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { sendModerationEmail } from './moderationEmailService.server';
import { TenantSettingsService } from './tenantSettingsService.server';

vi.mock('src/.server/resend');
vi.mock('src/repository/supabaseAdmin.server');
vi.mock('./tenantSettingsService.server');

const SETTINGS = {
  siteName: 'Precious Plastic',
  siteUrl: 'https://community.preciousplastic.com',
  messageSignOff: 'One Army',
  emailFrom: 'hello@onearmy.earth',
};

const setup = (opts: { email?: string | null; sendError?: string } = {}) => {
  const getUserById = vi.fn().mockResolvedValue({
    data:
      opts.email === null ? { user: null } : { user: { email: opts.email ?? 'org@example.com' } },
    error: null,
  });

  (createSupabaseAdminServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    auth: { admin: { getUserById } },
  });

  (TenantSettingsService as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { get: vi.fn().mockResolvedValue(SETTINGS) };
  });

  (sendEmail as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({ error: opts.sendError });

  return { getUserById };
};

const args = {
  authId: 'auth-1',
  client: {} as SupabaseClient,
  feedback: 'Add a photo of the machines.',
  requestOrigin: 'http://localhost:3000',
  username: 'the_shop',
};

const sentPayload = () => (sendEmail as unknown as ReturnType<typeof vi.fn>).mock.calls[0][0];

describe('sendModerationEmail', () => {
  beforeEach(() => vi.clearAllMocks());

  it('sends through the app mail path, from the tenant address', async () => {
    setup();

    const sent = await sendModerationEmail({ ...args, moderation: 'accepted' });

    expect(sent).toBe(true);
    expect(sentPayload().from).toBe('One Army <hello@onearmy.earth>');
    expect(sentPayload().to).toBe('org@example.com');
  });

  it('subjects each outcome differently', async () => {
    setup();
    await sendModerationEmail({ ...args, moderation: 'improvements-needed' });
    expect(sentPayload().subject).toBe(
      'Almost there — your organisation profile needs a few changes',
    );
  });

  it('sends a confirmation when the application is first submitted', async () => {
    setup();

    const sent = await sendModerationEmail({ ...args, moderation: 'awaiting-moderation' });

    expect(sent).toBe(true);
    expect(sentPayload().subject).toBe('Your organisation application is in');
    expect(sentPayload().emailTemplate.props.settingsUrl).toContain('/settings/profile');
  });

  it('sends for a rejection, which the shared edge template could not express', async () => {
    setup();

    const sent = await sendModerationEmail({ ...args, moderation: 'rejected' });

    expect(sent).toBe(true);
    expect(sentPayload().subject).toBe('About your organisation application');
  });

  it('passes the moderator feedback into the template', async () => {
    setup();

    await sendModerationEmail({ ...args, moderation: 'improvements-needed' });

    expect(sentPayload().emailTemplate.props.feedback).toBe('Add a photo of the machines.');
    expect(sentPayload().emailTemplate.props.settingsUrl).toContain('/settings/profile');
  });

  it('links an approved applicant to their public profile', async () => {
    setup();

    await sendModerationEmail({ ...args, moderation: 'accepted' });

    expect(sentPayload().emailTemplate.props.profileUrl).toContain('/u/the_shop');
  });

  it('addresses the applicant by username, as the designs do', async () => {
    setup();

    await sendModerationEmail({ ...args, moderation: 'accepted' });

    expect(sentPayload().emailTemplate.props.username).toBe('the_shop');
  });

  it('skips accounts with no auth id rather than throwing', async () => {
    const { getUserById } = setup();

    const sent = await sendModerationEmail({
      ...args,
      authId: null,
      moderation: 'improvements-needed',
    });

    expect(sent).toBe(false);
    expect(getUserById).not.toHaveBeenCalled();
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('reports failure when the applicant has no email address', async () => {
    setup({ email: null });

    const sent = await sendModerationEmail({ ...args, moderation: 'accepted' });

    expect(sent).toBe(false);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it('reports failure when the send errors', async () => {
    setup({ sendError: 'boom' });

    const sent = await sendModerationEmail({ ...args, moderation: 'accepted' });

    expect(sent).toBe(false);
  });

  it('swallows a thrown mail error rather than failing the moderation', async () => {
    setup();
    (sendEmail as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error('Missing API key.'),
    );

    const sent = await sendModerationEmail({ ...args, moderation: 'accepted' });

    expect(sent).toBe(false);
  });

  it('swallows a failure while resolving the applicant address', async () => {
    setup();
    (createSupabaseAdminServerClient as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => {
        throw new Error('admin client unavailable');
      },
    );

    const sent = await sendModerationEmail({ ...args, moderation: 'accepted' });

    expect(sent).toBe(false);
    expect(sendEmail).not.toHaveBeenCalled();
  });
});
