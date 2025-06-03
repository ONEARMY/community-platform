import type { SupabaseClient } from '@supabase/supabase-js'
import type { DBNotificationsPreferences } from 'shared/lib'

const getPreferences = async (client: SupabaseClient, profileId: number) => {
  try {
    const { data } = await client
      .from('notifications_preferences')
      .select()
      .eq('user_id', profileId)
      .single()

    if (data) {
      return data as DBNotificationsPreferences
    }
  } catch (error) {
    console.error(error)
    return Response.json(error, { status: 500, statusText: error.statusText })
  }

  return null
}

export const notificationsPreferencesServiceServer = {
  getPreferences,
}
