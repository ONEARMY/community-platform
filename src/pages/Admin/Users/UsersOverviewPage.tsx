import type { ProfileTypeCount, SupporterBadgeCount } from 'oa-shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-2xl font-semibold">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

interface IProps {
  profileTypeCounts: ProfileTypeCount[];
  supporterBadgeCounts: SupporterBadgeCount[];
}

export function UsersOverviewPage({ profileTypeCounts, supporterBadgeCounts }: IProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Overview</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {profileTypeCounts.map((profileType) => (
                <StatTile
                  key={profileType.profile_type_id}
                  label={profileType.display_name}
                  value={profileType.profile_count}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Supporters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {supporterBadgeCounts.map((badge) => (
                <StatTile
                  key={badge.badge_id}
                  label={badge.badge_name}
                  value={badge.supporter_count}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
