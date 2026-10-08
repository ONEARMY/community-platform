import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { TenantSettingsService } from 'src/services/tenantSettingsService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action } from './api.admin.settings';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/tenantSettingsService.server');

const setup = () => {
  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: {},
    headers: new Headers(),
  });

  const update = vi.fn().mockResolvedValue(undefined);

  (TenantSettingsService as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { update };
  });

  return { update };
};

const put = (body: object) =>
  action({
    request: new Request('http://localhost/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
    params: {},
    context: {},
  } as any) as Promise<Response>;

describe('admin settings', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rejects a colour that is not hex', async () => {
    const { update } = setup();

    const res = await put({ colorSecondary: 'red;}</style>' });

    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  it('requires the primary and accent colours', async () => {
    const { update } = setup();

    const res = await put({ colorPrimary: '' });

    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  it('saves the theme colours and keeps fields that are not sent', async () => {
    const { update } = setup();

    const res = await put({
      colorPrimary: '#fee77b',
      colorPrimaryHover: '#ffde45',
      colorAccent: '#FFF',
      colorAccentHover: '#eee',
      colorSecondary: '',
    });

    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledWith({
      colorPrimary: '#fee77b',
      colorPrimaryHover: '#ffde45',
      colorAccent: '#FFF',
      colorAccentHover: '#eee',
      colorSecondary: null,
      newsCtaTitle: undefined,
      newsCtaBody: undefined,
      newsCtaImageUrl: undefined,
    });
  });

  it('saves the call to action', async () => {
    const { update } = setup();

    const res = await put({
      newsCtaTitle: ' Join us ',
      newsCtaBody: 'Members read everything',
      newsCtaImageUrl: 'https://example.com/icon.png',
    });

    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        colorPrimary: undefined,
        newsCtaTitle: 'Join us',
        newsCtaBody: 'Members read everything',
        newsCtaImageUrl: 'https://example.com/icon.png',
      }),
    );
  });

  it('rejects an image that is not a url', async () => {
    const { update } = setup();

    const res = await put({ newsCtaImageUrl: 'javascript:alert(1)' });

    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });
});
