import type { DBMedia } from 'oa-shared';
import type { LoaderFunctionArgs } from 'react-router';
import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { ImageServiceServer } from 'src/services/imageService.server';
import { fromJson } from 'src/utils/supabase.types';

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client, headers } = createSupabaseServerClient(request);

  try {
    const donationSettingsResult = await client.from('tenant_settings').select('donation_settings');
    const data = donationSettingsResult.data?.at(0);
    const ds = data?.donation_settings as Record<string, string> | null | undefined;

    const donationSettings = {
      spaceName: '',
      campaignId: ds?.defaultCampaignId,
      description: ds?.defaultDescription,
      imageUrl: ds?.defaultImageUrl,
    };

    if (params.profileId) {
      try {
        const profileResult = await client
          .from('profiles')
          .select('display_name,cover_images,donations_enabled')
          .eq('id', Number(params.profileId))
          .single();

        if (profileResult.data?.donations_enabled) {
          donationSettings.spaceName = profileResult.data.display_name;
          donationSettings.campaignId = `${process.env.TENANT_ID}-${params.profileId}`;
          donationSettings.description = ds?.spaceDescription;

          if (profileResult.data.cover_images?.at(0)) {
            donationSettings.imageUrl = new ImageServiceServer(client).getPublicUrl(
              fromJson<DBMedia | null>(profileResult.data.cover_images[0]),
            )?.publicUrl;
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
