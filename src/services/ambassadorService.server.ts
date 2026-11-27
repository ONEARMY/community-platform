import { randomInt } from 'node:crypto';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from 'oa-shared';

const SUFFIX_CHARACTERS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const SUFFIX_LENGTH = 4;
const NAME_MAX_LENGTH = 8;
const FALLBACK_NAME = 'MEMBER';
const MAX_ATTEMPTS = 5;
const UNIQUE_VIOLATION = '23505';

export const generateAmbassadorCode = (displayName: string | null | undefined) => {
  const name =
    (displayName ?? '')
      .normalize('NFD')
      .replace(/[^A-Za-z]/g, '')
      .toUpperCase()
      .slice(0, NAME_MAX_LENGTH) || FALLBACK_NAME;

  const suffix = Array.from(
    { length: SUFFIX_LENGTH },
    () => SUFFIX_CHARACTERS[randomInt(SUFFIX_CHARACTERS.length)],
  ).join('');

  return `${name}-${suffix}`;
};

export class AmbassadorServiceServer {
  constructor(private client: SupabaseClient<Database>) {}

  async getByProfileId(profileId: number) {
    const { data } = await this.client
      .from('ambassador_codes')
      .select('profile_id,code,active')
      .eq('profile_id', profileId)
      .maybeSingle();

    return data;
  }

  async getByCode(code: string) {
    const { data } = await this.client
      .from('ambassador_codes')
      .select('profile_id,code,active')
      .eq('code', code.trim().toUpperCase())
      .maybeSingle();

    return data;
  }

  async getOrCreateForProfile(profileId: number) {
    const existing = await this.getByProfileId(profileId);

    if (existing) {
      return existing;
    }

    const { data: profile } = await this.client
      .from('profiles')
      .select('display_name')
      .eq('id', profileId)
      .single();

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const { data, error } = await this.client
        .from('ambassador_codes')
        .insert({
          profile_id: profileId,
          code: generateAmbassadorCode(profile?.display_name),
          tenant_id: process.env.TENANT_ID!,
        })
        .select('profile_id,code,active')
        .single();

      if (!error) {
        return data;
      }

      if (error.code !== UNIQUE_VIOLATION) {
        throw error;
      }

      const created = await this.getByProfileId(profileId);

      if (created) {
        return created;
      }
    }

    throw new Error('Could not create a unique ambassador code');
  }
}
