import { createClient } from 'jsr:@supabase/supabase-js@2.46.1';

export async function getTenantSettings(req, redirect_to) {
  const tenantId = hackyWayToGetTenantId(req.headers, redirect_to);
  const client = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('PUBLISHABLE_KEY') ?? '',
    {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')!,
          'x-tenant-id': tenantId,
        },
      },
    },
  );

  const { data } = await client
    .from('tenant_settings')
    .select('site_name,site_url,message_sign_off,email_from,site_image')
    .single();

  return {
    siteName: data?.site_name || 'The Community Platform',
    siteUrl: data?.site_url || 'https://community.preciousplastic.com',
    messageSignOff: data?.message_sign_off || 'One Army',
    emailFrom: data?.email_from || 'hello@onearmy.earth',
    siteImage:
      data?.site_image || 'https://community.preciousplastic.com/assets/img/one-army-logo.png',
  };
}

const hackyWayToGetTenantId = (headers, url: string | undefined): string => {
  const tenantIdMap = {
    projectkamp: 'project-kamp',
    preciousplastic: 'precious-plastic',
    fixing: 'fixing-fashion',
  };
  if (headers.get('x-tenant-id')) {
    return headers.get('x-tenant-id');
  }

  if (url) {
    const address = new URL(url);
    const host = address.host.split('.')[1];
    return tenantIdMap[host] || '';
  }

  return '';
};
