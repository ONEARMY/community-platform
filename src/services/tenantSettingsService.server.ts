import type { SupabaseClient } from '@supabase/supabase-js';
import Keyv from 'keyv';
import { PWAIcons, TenantSettings, UserRole } from 'oa-shared';
import { isProductionEnvironment } from 'src/config/config';

const cache = new Keyv<TenantSettings>({ ttl: 3600000 }); // ttl: 60 minutes

export class TenantSettingsService {
  constructor(private client: SupabaseClient) {}

  async get(cacheBypass = false): Promise<TenantSettings> {
    if (!cacheBypass) {
      const cachedTenantSettings = await cache.get('tenant-settings');

      if (cachedTenantSettings && isProductionEnvironment()) {
        return cachedTenantSettings;
      }
    }

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
        patreon_id,
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

    const settings = new TenantSettings({
      siteName: data?.site_name || 'The Community Platform',
      siteDescription: data?.site_description || 'The Community Platform',
      siteUrl: data?.site_url || 'https://community.preciousplastic.com',
      messageSignOff: data?.message_sign_off || 'One Army',
      emailFrom: data?.email_from || 'hello@onearmy.earth',
      siteImage:
        data?.site_image || 'https://community.preciousplastic.com/assets/img/one-army-logo.png',
      noMessaging: data?.no_messaging || false,
      academyResource: data?.academy_resource,
      libraryHeading: data?.library_heading,
      patreonId: data?.patreon_id,
      profileGuidelines: data?.profile_guidelines,
      questionsGuidelines: data?.questions_guidelines,
      supportedModules: data?.supported_modules,
      colorPrimary: data?.color_primary,
      colorPrimaryHover: data?.color_primary_hover,
      colorAccent: data?.color_accent,
      colorAccentHover: data?.color_accent_hover,
      showImpact: data?.show_impact,
      createResearchRoles: this.validateRoles(data?.create_research_roles),
      gaTrackingId: data?.ga_tracking_id,
      pwaIcons: (data?.pwa_icons as PWAIcons) ?? undefined,
    });

    cache.set('tenant-settings', settings);

    return settings;
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
