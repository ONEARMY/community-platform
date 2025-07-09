import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBNotificationsPreferences } from 'oa-shared'

const getPreferences = async (
  client: SupabaseClient,
  profileId: number,
): Promise<DBNotificationsPreferences | null> => {
  try {
    const { data } = await client
      .from('notifications_preferences')
      .select()
      .eq('user_id', profileId)
      .single()

    return data as DBNotificationsPreferences
  } catch (error) {
    console.error('Failed to get notifications preferences:', error)
    throw Response.json(error, { status: 500, statusText: error.statusText })
  }
}

export const notificationsPreferencesServiceServer = {
  getPreferences,
}
