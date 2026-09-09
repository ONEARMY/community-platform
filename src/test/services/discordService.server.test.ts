import { discordServiceServer } from 'src/services/discordService.server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const WEBHOOK = 'https://discord.com/api/webhooks/test';

const sentBody = () => JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string);

describe('postWebhookRequest', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('suppresses every mention, so an @everyone in a name cannot ping the channel', async () => {
    await discordServiceServer.postWebhookRequest('@everyone is now a Supporter', WEBHOOK);

    expect(sentBody()).toEqual({
      content: '@everyone is now a Supporter',
      allowed_mentions: { parse: [] },
    });
  });

  it('posts to the given webhook', async () => {
    await discordServiceServer.postWebhookRequest('hello', WEBHOOK);

    expect(fetch).toHaveBeenCalledWith(WEBHOOK, expect.objectContaining({ method: 'POST' }));
  });

  it('falls back to the general activity webhook when none is given', async () => {
    vi.stubEnv('DISCORD_WEBHOOK_URL', 'https://discord.com/api/webhooks/activity');

    await discordServiceServer.postWebhookRequest('hello');

    expect(fetch).toHaveBeenCalledWith(
      'https://discord.com/api/webhooks/activity',
      expect.anything(),
    );
  });

  it('does not post when no webhook is configured at all', async () => {
    vi.stubEnv('DISCORD_WEBHOOK_URL', '');

    await discordServiceServer.postWebhookRequest('hello');

    expect(fetch).not.toHaveBeenCalled();
  });
});
