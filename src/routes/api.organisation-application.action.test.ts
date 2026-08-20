import { ProfileFactory } from 'src/factories/profileFactory.server';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { OrganisationApplicationsServiceServer } from 'src/services/organisationApplicationsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';
import { ProfileTypesServiceServer } from 'src/services/profileTypesService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { action } from './api.organisation-application';

vi.mock('src/repository/supabase.server');
vi.mock('src/services/organisationApplicationsService.server');
vi.mock('src/services/profileService.server');
vi.mock('src/services/profileTypesService.server');
vi.mock('src/factories/profileFactory.server');

const validFields = {
  type: 'machine-builder',
  username: 'valid_org',
  displayName: 'The Machine Shop',
  about: 'We build machines for the local recycling network.',
  coverImages: [{ id: 'img-1' }],
};

// biome-ignore lint/suspicious/noExplicitAny: minimal form field map
const buildRequest = (fields: Record<string, any> = validFields) => {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(fields)) {
    if (key === 'coverImages') {
      for (const img of value) body.append('coverImages', JSON.stringify(img));
    } else if (value != null) {
      body.append(key, String(value));
    }
  }
  // URLSearchParams sets Content-Type: application/x-www-form-urlencoded so request.formData() parses
  return new Request('http://localhost/api/organisation-application', { method: 'POST', body });
};

const setup = (opts: {
  hasApplication: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: existing profile stub or null
  existingProfile?: any;
  // biome-ignore lint/suspicious/noExplicitAny: create result stub
  createResult?: any;
  usernameAvailable?: boolean;
}) => {
  const getClaims = vi.fn().mockResolvedValue({ data: { claims: { sub: 'auth-1' } } });
  const rpc = vi.fn().mockResolvedValue({ data: opts.usernameAvailable ?? true });

  (createSupabaseServerClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
    client: { auth: { getClaims }, rpc },
    headers: new Headers(),
  });

  (OrganisationApplicationsServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(
    function () {
      return {
        existsByAuthId: vi.fn().mockResolvedValue(opts.hasApplication),
        deleteByAuthId: vi.fn().mockResolvedValue({}),
      };
    },
  );

  (ProfileServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      getByAuthId: vi.fn().mockResolvedValue(opts.existingProfile ?? null),
      createOrganisationProfile: vi.fn().mockResolvedValue(opts.createResult ?? { data: {}, error: null }),
      updateUserActivity: vi.fn().mockResolvedValue({}),
    };
  });

  (ProfileTypesServiceServer as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return {
      get: vi.fn().mockResolvedValue([{ id: 5, name: 'machine-builder', isSpace: true }]),
    };
  });

  (ProfileFactory as unknown as ReturnType<typeof vi.fn>).mockImplementation(function () {
    return { fromDB: vi.fn().mockReturnValue({ username: 'valid_org' }) };
  });
};

// biome-ignore lint/suspicious/noExplicitAny: minimal ActionFunctionArgs stub
const actionArgs = (request: Request) => ({ request, params: {}, context: {} }) as any;

describe('organisation application action — authorization guards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects an account that has no organisation application (403)', async () => {
    setup({ hasApplication: false });

    const res = (await action(actionArgs(buildRequest()))) as Response;

    expect(res.status).toBe(403);
  });

  it('rejects an account that already has a profile (403)', async () => {
    setup({ hasApplication: true, existingProfile: { id: 1 } });

    const res = (await action(actionArgs(buildRequest()))) as Response;

    expect(res.status).toBe(403);
  });

  it('maps a 23505 unique-constraint error to a username validation error (400)', async () => {
    setup({
      hasApplication: true,
      existingProfile: null,
      createResult: { data: null, error: { code: '23505' } },
    });

    const res = (await action(actionArgs(buildRequest()))) as Response;

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.field).toBe('username');
    expect(body.error).toBe('Username is already taken');
  });
});
