import type { SupabaseClient } from '@supabase/supabase-js';
import Keyv from 'keyv';
import { PWAIcons, TenantSettings, UserRole } from 'oa-shared';
import { isProductionEnvironment } from 'src/config/config';

const CACHE_TTL_MS = 1000 * 60 * 60;
const MEMBERSHIP_TIERS_ERROR_TTL_MS = 1000 * 30;
const cache = new Keyv<TenantSettings>({ ttl: CACHE_TTL_MS });
const membershipTiersCache = new Keyv<boolean>({ ttl: CACHE_TTL_MS });

export class TenantSettingsService {
  constructor(
    private client: SupabaseClient,
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
      siteDescription: data?.site_description || 'The Community Platform',
      siteUrl: data?.site_url || this.origin || 'https://community.preciousplastic.com',
      messageSignOff: data?.message_sign_off || 'One Army',
      emailFrom: data?.email_from || 'hello@onearmy.earth',
      siteImage:
        data?.site_image || 'https://community.preciousplastic.com/assets/img/one-army-logo.png',
      noMessaging: data?.no_messaging || false,
      academyResource: data?.academy_resource,
      libraryHeading: data?.library_heading,
      profileGuidelines: data?.profile_guidelines,
      questionsGuidelines: data?.questions_guidelines,
      supportedModules: data?.supported_modules,
      hiddenModules: data?.hidden_modules,
      colorPrimary: data?.color_primary,
      colorPrimaryHover: data?.color_primary_hover,
      colorAccent: data?.color_accent,
      colorAccentHover: data?.color_accent_hover,
      showImpact: data?.show_impact,
      hasMembershipTiers,
      createResearchRoles: this.validateRoles(data?.create_research_roles),
      gaTrackingId: data?.ga_tracking_id,
      pwaIcons: (data?.pwa_icons as PWAIcons) ?? undefined,
    });

    cache.set('tenant-settings', settings);

    return settings;
  }

  private async fetchSettingsRow() {
    const { data } = await this.client
      .from('tenant_settings')
      .select(
        `site_name,
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
        pwa_icons`,
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
        console.error('Error checking membership tiers:', error);
        return null;
      }

      return (count ?? 0) > 0;
    } catch (error) {
      console.error('Error checking membership tiers:', error);
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
