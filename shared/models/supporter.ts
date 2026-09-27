// Supporter row returned by the get_supporters RPC function
export interface Supporter {
  profile_id: number;
  username: string | null;
  display_name: string;
  email: string | null;
  tier_name: string;
}
