// Row returned by the get_profile_type_counts RPC function
export interface ProfileTypeCount {
  profile_type_id: number;
  name: string;
  display_name: string;
  profile_count: number;
}

// Row returned by the get_supporter_badge_counts RPC function
export interface SupporterBadgeCount {
  badge_id: number;
  badge_name: string;
  supporter_count: number;
}
