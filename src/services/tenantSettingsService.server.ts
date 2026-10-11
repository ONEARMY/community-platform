import type { SupabaseClient } from '@supabase/supabase-js';
import Keyv from 'keyv';
import type { Database } from 'oa-shared';
import { TenantSettings, UserRole } from 'oa-shared';
import { isProductionEnvironment } from 'src/config/config';
import { logger } from 'src/logger';

const CACHE_TTL_MS = 1000 * 60 * 60;
const MEMBERSHIP_TIERS_ERROR_TTL_MS = 1000 * 30;
const cache = new Keyv<TenantSettings>({ ttl: CACHE_TTL_MS });
const membershipTiersCache = new Keyv<boolean>({ ttl: CACHE_TTL_MS });

export class TenantSettingsService {
  constructor(
    private client: SupabaseClient<Database>,
    private origin?: string,
  ) {}

  async get(cacheBypass = false): Promise<TenantSettings> {
    const cachedTenantSettings =
      !cacheBypass && isProductionEnvironment() ? await cache.get('tenant-settings') : undefined;

    const [data, hasMembershipTiers] = await Promise.all([
      cachedTenantSettings ? null : this.fetchSettingsRow(),
      this.getMembershipTiers(cacheBypass),
    ]);

    if (cachedTenantSettings) {
      cachedTenantSettings.hasMembershipTiers = hasMembershipTiers;
      return cachedTenantSettings;
    }

    const settings = new TenantSettings({
      siteName: data?.site_name || 'The Community Platform',
      siteNameShort: data?.site_name_short || '',
      siteDescription: data?.site_description || 'The Community Platform',
      siteUrl: data?.site_url || this.origin || 'https://community.preciousplastic.com',
      messageSignOff: data?.message_sign_off || 'One Army',
      emailFrom: data?.email_from || 'hello@onearmy.earth',
      siteImage:
        data?.site_image || 'https://community.preciousplastic.com/assets/img/one-army-logo.png',
      noMessaging: data?.no_messaging || false,
      academyResource: data?.academy_resource ?? undefined,
      libraryHeading: data?.library_heading ?? undefined,
      profileGuidelines: data?.profile_guidelines ?? undefined,
      questionsGuidelines: data?.questions_guidelines ?? undefined,
      supportedModules: data?.supported_modules ?? undefined,
      hiddenModules: data?.hidden_modules ?? undefined,
      colorPrimary: data?.color_primary ?? undefined,
      colorPrimaryHover: data?.color_primary_hover ?? undefined,
      colorAccent: data?.color_accent ?? undefined,
      colorAccentHover: data?.color_accent_hover ?? undefined,
      showImpact: data?.show_impact ?? undefined,
      hasMembershipTiers,
      createResearchRoles: this.validateRoles(data?.create_research_roles),
      gaTrackingId: data?.ga_tracking_id ?? undefined,
      membershipTerms: data?.membership_terms ?? undefined,
      pwaIcons: data?.pwa_icons ?? undefined,
      organisationSignupDescriptionHtml: data?.organisation_signup_description ?? undefined,
      organisationActivity: data?.organisation_activity ?? undefined,
    });

    cache.set('tenant-settings', settings);

    return settings;
  }

  private async fetchSettingsRow() {
    const { data } = await this.client
      .from('tenant_settings')
      .select(
        `site_name,
        site_name_short,
        site_description,
        site_url,
        message_sign_off,
        email_from,
        site_image,
        no_messaging,
        library_heading,
        academy_resource,
        profile_guidelines,
        questions_guidelines,
        supported_modules,
        hidden_modules,
        color_primary,
        color_primary_hover,
        color_accent,
        color_accent_hover,
        show_impact,
        create_research_roles,
        ga_tracking_id,
        pwa_icons,
        membership_terms,
        organisation_signup_description,
        organisation_activity`,
      )
      .single();

    return data;
  }

  private async getMembershipTiers(cacheBypass: boolean): Promise<boolean> {
    if (!cacheBypass && isProductionEnvironment()) {
      const cached = await membershipTiersCache.get('membership-tiers');
      if (cached !== undefined) {
        return cached;
      }
    }

    const result = await this.checkMembershipTiers();
    const hasMembershipTiers = result ?? false;

    membershipTiersCache.set(
      'membership-tiers',
      hasMembershipTiers,
      result === null ? MEMBERSHIP_TIERS_ERROR_TTL_MS : CACHE_TTL_MS,
    );

    return hasMembershipTiers;
  }

  private async checkMembershipTiers(): Promise<boolean | null> {
    try {
      const { count, error } = await this.client
        .from('stripe_tier_config')
        .select('id', { count: 'exact', head: true });

      if (error) {
        logger.error('Error checking membership tiers:', error);
        return null;
      }

      return (count ?? 0) > 0;
    } catch (error) {
      logger.error('Error checking membership tiers:', error);
      return null;
    }
  }

  private validateRoles(
    create_research_roles: string[] | undefined | null,
  ): UserRole[] | undefined {
    if (!create_research_roles || create_research_roles.length === 0) {
      return undefined;
    }

    const validRoles = Object.values(UserRole);
    const validated = create_research_roles.filter((role) =>
      validRoles.includes(role as UserRole),
    ) as UserRole[];

    return validated.length > 0 ? validated : undefined;
  }
}
