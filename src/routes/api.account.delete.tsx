import { createSupabaseServerClient } from 'src/repository/supabase.server';
import { createSupabaseAdminServerClient } from 'src/repository/supabaseAdmin.server';
import { MapPinsServiceServer } from 'src/services/mapPinsService.server';
import { ProfileServiceServer } from 'src/services/profileService.server';

import type { ActionFunctionArgs } from 'react-router';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { client, headers } = createSupabaseServerClient(request);
  const adminClient = createSupabaseAdminServerClient();

  if (request.method !== 'DELETE') {
    return Response.json({ error: 'Method not allowed' }, { headers, status: 405 });
  }

  try {
    const claims = await client.auth.getClaims();

    if (!claims.data?.claims) {
      return Response.json({ error: 'Unauthorized' }, { headers, status: 401 });
    }

    const profileService = new ProfileServiceServer(client);
    const profile = await profileService.getByAuthId(claims.data.claims.sub);

    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { headers, status: 404 });
    }

    // 1. Delete Firebase map pin (if exists)
    try {
      const mapPinsService = new MapPinsServiceServer(client);
      await mapPinsService.delete(profile.id);
    } catch (error) {
      // Map pin might not exist, continue with deletion
      console.warn('Error deleting map pin (may not exist):', error);
    }

    // 2. Hard delete secondary content (comments, notifications, votes)
    // Votes are automatically deleted via CASCADE, but we'll delete comments and notifications

    // Delete comments created by this user
    await client
      .from('comments')
      .delete()
      .eq('created_by', profile.id);

    // Delete notifications owned by or triggered by this user
    await client
      .from('notifications')
      .delete()
      .or(`owned_by_id.eq.${profile.id},triggered_by_id.eq.${profile.id}`);

    // Delete notification preferences
    await client
      .from('notifications_preferences')
      .delete()
      .eq('user_id', profile.id);

    // 3. Set created_by to null for primary content (Research, News, Questions, Library)
    // This is handled automatically by the database foreign key constraints (ON DELETE SET NULL)
    // But we can also do it explicitly to be safe
    await client
      .from('research')
      .update({ created_by: null })
      .eq('created_by', profile.id);

    await client
      .from('research_updates')
      .update({ created_by: null })
      .eq('created_by', profile.id);

    await client
      .from('news')
      .update({ created_by: null })
      .eq('created_by', profile.id);

    await client
      .from('questions')
      .update({ created_by: null })
      .eq('created_by', profile.id);

    await client
      .from('projects')
      .update({ created_by: null })
      .eq('created_by', profile.id);

    // 4. Delete the Supabase auth user using admin client (this will cascade delete the profile via foreign key)
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(claims.data.claims.sub);

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError);
      return Response.json(
        { error: 'Failed to delete user account' },
        { headers, status: 500 },
      );
    }

    return Response.json({ success: true }, { headers, status: 200 });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return Response.json(
      { error: 'Failed to delete profile' },
      { headers, status: 500 },
    );
  }
};
