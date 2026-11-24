import {
  AmbassadorServiceServer,
  generateAmbassadorCode,
} from 'src/services/ambassadorService.server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const single = vi.fn();
const maybeSingle = vi.fn();
const query: any = {
  select: vi.fn(() => query),
  insert: vi.fn(() => query),
  eq: vi.fn(() => query),
  single,
  maybeSingle,
};
const mockClient: any = { from: vi.fn(() => query) };

const SUFFIX = /^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/;
const uniqueViolation = { code: '23505', message: 'duplicate key value' };

describe('generateAmbassadorCode', () => {
  it('builds NAME-XXXX from the display name', () => {
    const [name, suffix] = generateAmbassadorCode('Dave').split('-');

    expect(name).toBe('DAVE');
    expect(suffix).toMatch(SUFFIX);
  });

  it('keeps only letters, strips accents and caps the name at 8 letters', () => {
    expect(generateAmbassadorCode('Zoë O’Brien-Smith 3rd').split('-')[0]).toBe('ZOEOBRIE');
  });

  it('falls back to MEMBER when no Latin letters are left', () => {
    expect(generateAmbassadorCode('李小龙').split('-')[0]).toBe('MEMBER');
    expect(generateAmbassadorCode('').split('-')[0]).toBe('MEMBER');
    expect(generateAmbassadorCode(null).split('-')[0]).toBe('MEMBER');
  });

  it('never uses 0, O, 1, I or L in the random part', () => {
    const suffixes = Array.from({ length: 2000 }, () => generateAmbassadorCode('x').split('-')[1]);

    expect(suffixes.join('')).not.toMatch(/[0O1IL]/);
    suffixes.forEach((suffix) => expect(suffix).toMatch(SUFFIX));
  });
});

describe('AmbassadorServiceServer', () => {
  const service = () => new AmbassadorServiceServer(mockClient);

  beforeEach(() => {
    vi.clearAllMocks();
    single.mockReset();
    maybeSingle.mockReset();
    process.env.TENANT_ID = 'tenant-a';
  });

  it('returns the existing code without creating one', async () => {
    maybeSingle.mockResolvedValueOnce({ data: { profile_id: 7, code: 'DAVE-X4K2', active: true } });

    const result = await service().getOrCreateForProfile(7);

    expect(result.code).toBe('DAVE-X4K2');
    expect(query.insert).not.toHaveBeenCalled();
  });

  it('creates a code from the display name on first visit', async () => {
    maybeSingle.mockResolvedValueOnce({ data: null });
    single
      .mockResolvedValueOnce({ data: { display_name: 'Dave' } })
      .mockImplementationOnce(async () => ({
        data: { ...query.insert.mock.calls[0][0], active: true },
        error: null,
      }));

    const result = await service().getOrCreateForProfile(7);

    expect(query.insert).toHaveBeenCalledWith({
      profile_id: 7,
      code: expect.stringMatching(/^DAVE-/),
      tenant_id: 'tenant-a',
    });
    expect(result.code).toMatch(/^DAVE-/);
  });

  it('retries with a fresh code after a collision', async () => {
    maybeSingle.mockResolvedValue({ data: null });
    single
      .mockResolvedValueOnce({ data: { display_name: 'Dave' } })
      .mockResolvedValueOnce({ data: null, error: uniqueViolation })
      .mockResolvedValueOnce({
        data: { profile_id: 7, code: 'DAVE-X4K2', active: true },
        error: null,
      });

    const result = await service().getOrCreateForProfile(7);

    expect(query.insert).toHaveBeenCalledTimes(2);
    expect(result.code).toBe('DAVE-X4K2');
  });

  it('returns the code a concurrent request created for the same profile', async () => {
    maybeSingle
      .mockResolvedValueOnce({ data: null })
      .mockResolvedValueOnce({ data: { profile_id: 7, code: 'DAVE-AAAA', active: true } });
    single
      .mockResolvedValueOnce({ data: { display_name: 'Dave' } })
      .mockResolvedValueOnce({ data: null, error: uniqueViolation });

    const result = await service().getOrCreateForProfile(7);

    expect(query.insert).toHaveBeenCalledTimes(1);
    expect(result.code).toBe('DAVE-AAAA');
  });

  it('gives up after repeated collisions', async () => {
    maybeSingle.mockResolvedValue({ data: null });
    single
      .mockResolvedValueOnce({ data: { display_name: 'Dave' } })
      .mockResolvedValue({ data: null, error: uniqueViolation });

    await expect(service().getOrCreateForProfile(7)).rejects.toThrow('unique ambassador code');
    expect(query.insert).toHaveBeenCalledTimes(5);
  });

  it('rethrows errors other than a collision', async () => {
    maybeSingle.mockResolvedValue({ data: null });
    single
      .mockResolvedValueOnce({ data: { display_name: 'Dave' } })
      .mockResolvedValueOnce({ data: null, error: { code: '42501', message: 'denied' } });

    await expect(service().getOrCreateForProfile(7)).rejects.toMatchObject({ code: '42501' });
    expect(query.insert).toHaveBeenCalledTimes(1);
  });

  it('looks a code up ignoring case and surrounding spaces', async () => {
    maybeSingle.mockResolvedValueOnce({ data: { profile_id: 7, code: 'DAVE-X4K2', active: true } });

    const result = await service().getByCode('  dave-x4k2 ');

    expect(query.eq).toHaveBeenCalledWith('code', 'DAVE-X4K2');
    expect(result?.profile_id).toBe(7);
  });
});
