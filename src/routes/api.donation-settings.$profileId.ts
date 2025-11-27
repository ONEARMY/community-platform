import { createSupabaseServerClient } from 'src/repository/supabase.server';

import type { LoaderFunctionArgs } from 'react-router';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const donationSettingsResult = await client.from('tenant_settings').select('donation_settings');
    const data = donationSettingsResult.data?.at(0);

    const donationSettings = {
      spaceName: '',
      campaignId: data?.donation_settings?.defaultCampaignId,
      description: data?.donation_settings?.defaultDescription,
      imageUrl: data?.donation_settings?.defaultImageUrl,
    };

    if (params.profileId) {
      try {
        const profileResult = await client
          .from('profiles')
          .select('display_name,cover_images,donations_enabled')
          .eq('id', params.profileId)
          .single();

        if (profileResult.data?.donations_enabled) {
          donationSettings.spaceName = profileResult.data.display_name;
          donationSettings.campaignId = `${process.env.TENANT_ID}-${params.profileId}`;
          donationSettings.description = data?.donation_settings?.spaceDescription;

          if (profileResult.data.cover_images?.at(0)?.url) {
            donationSettings.imageUrl = profileResult.data.cover_images[0].url;
          }
        }
      } catch (error) {
        console.error('Error fetching profile donation settings:', error);
      }
    }

    return Response.json(donationSettings, { headers, status: 200 });
  } catch (error) {
    console.error('Error fetching donation settings:', error);
    return Response.json({}, { headers, status: 500 });
  }
}
