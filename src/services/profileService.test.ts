import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { profileService } from './profileService';

vi.mock('src/logger', () => ({
  logger: { error: vi.fn() },
}));

const mockFetch = vi.fn();

const jsonResponse = (status: number, body: unknown = {}) =>
  new Response(JSON.stringify(body), { status });

describe('profileService.get', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockFetch.mockReset();
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  const get = async () => {
    const promise = profileService.get();
    await vi.runAllTimersAsync();
    return promise;
  };

  it('returns the profile', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse(200, { id: 1 }));

    expect(await get()).toEqual({ id: 1 });
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry when logged out', async () => {
    mockFetch.mockResolvedValueOnce(jsonResponse(401));

    expect(await get()).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('retries on server errors', async () => {
    mockFetch
      .mockResolvedValueOnce(jsonResponse(500))
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce(jsonResponse(200, { id: 1 }));

    expect(await get()).toEqual({ id: 1 });
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('gives up after three attempts', async () => {
    mockFetch.mockResolvedValue(jsonResponse(500));

    expect(await get()).toBeUndefined();
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });
});
