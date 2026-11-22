import type { NotificationStats } from 'oa-shared';
import { Link } from 'react-router';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { AdminPagination } from 'src/pages/Admin/AdminPagination';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  actionLabel,
  contentLabel,
  formatShare,
  preferenceRows,
  typeLabel,
  weekLabel,
  weekRange,
} from './notificationStats';

const DATE_TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

const SLICE_COLOURS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
];

const sliceColour = (index: number) => SLICE_COLOURS[index % SLICE_COLOURS.length];

export interface AdminNotification {
  id: number;
  title: string | null;
  actionType: string;
  contentType: string;
  isRead: boolean;
  createdAt: string;
  recipient: { username: string | null; displayName: string } | null;
}

export interface NotificationsPageProps {
  stats: NotificationStats;
  notifications: AdminNotification[];
  page: number;
  totalPages: number;
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-2xl font-semibold">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

interface Slice {
  key: string;
  label: string;
  value: number;
}

function SliceList({ slices, total }: { slices: Slice[]; total: number }) {
  return (
    <ul className="flex flex-col gap-1 text-sm">
      {slices.map((slice, index) => (
        <li key={slice.key} className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: sliceColour(index) }}
          />
          <span className="min-w-0 flex-1 truncate">{slice.label}</span>
          <span className="text-muted-foreground">{formatShare(slice.value, total)}</span>
        </li>
      ))}
    </ul>
  );
}

function PieCard({
  title,
  description,
  slices,
  total,
}: {
  title: string;
  description: string;
  slices: Slice[];
  total: number;
}) {
  const config: ChartConfig = Object.fromEntries(
    slices.map((slice) => [slice.key, { label: slice.label }]),
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {total === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            <>
              <ChartContainer config={config} className="mx-auto aspect-square max-h-56 w-full">
                <PieChart>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, _name, item) => (
                          <span>
                            {item.payload.label}: {formatShare(Number(value), total)}
                          </span>
                        )}
                      />
                    }
                  />
                  <Pie
                    isAnimationActive={false}
                    data={slices}
                    dataKey="value"
                    nameKey="key"
                    innerRadius={48}
                  >
                    {slices.map((slice, index) => (
                      <Cell key={slice.key} fill={sliceColour(index)} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <SliceList slices={slices} total={total} />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const CURRENT_SUFFIX = ' (current)';

function WeekTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const value = payload?.value ?? '';
  const isCurrent = value.endsWith(CURRENT_SUFFIX);

  return (
    <text x={x} y={y} textAnchor="middle" className="fill-muted-foreground text-xs">
      <tspan x={x} dy={12}>
        {isCurrent ? value.slice(0, -CURRENT_SUFFIX.length) : value}
      </tspan>
      {isCurrent && (
        <tspan x={x} dy={13}>
          current
        </tspan>
      )}
    </text>
  );
}

function WeeklyCard({ weekly }: { weekly: NotificationStats['weekly'] }) {
  const data = weekly.map((week, index) => ({
    ...week,
    label: weekLabel(week.week_start, index === weekly.length - 1),
    range: weekRange(week.week_start),
  }));
  const config: ChartConfig = { total: { label: 'Notifications', color: 'var(--color-chart-2)' } };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Notifications per week</CardTitle>
        <CardDescription>
          Weeks run Monday to Sunday (UTC). The latest week is still in progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-64 w-full">
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              interval="preserveEnd"
              minTickGap={12}
              height={44}
              tick={<WeekTick />}
            />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_label, payload) => payload?.[0]?.payload.range}
                />
              }
            />
            <Bar isAnimationActive={false} dataKey="total" fill="var(--color-total)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const PREFERENCE_SERIES: { key: string; label: string; colour: string }[] = [
  { key: 'enabled', label: 'Enabled', colour: 'var(--color-chart-2)' },
  { key: 'disabled', label: 'Disabled', colour: 'var(--color-chart-1)' },
  { key: 'all', label: 'All', colour: 'var(--color-chart-3)' },
  { key: 'important', label: 'Important only', colour: 'var(--color-chart-4)' },
  { key: 'unset', label: 'Not set', colour: 'var(--color-chart-5)' },
];

function PreferencesCard({ preferences }: { preferences: NotificationStats['preferences'] }) {
  const data = preferenceRows(preferences).map((row) => ({ name: row.label, ...row.values }));
  const config: ChartConfig = Object.fromEntries(
    PREFERENCE_SERIES.map((series) => [series.key, { label: series.label, color: series.colour }]),
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Notification preferences</CardTitle>
        <CardDescription>
          Share of the {preferences.total} members with saved preferences, per setting.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {preferences.total === 0 ? (
          <p className="text-sm text-muted-foreground">No preferences saved yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            <ChartContainer config={config} className="h-56 w-full">
              <BarChart data={data} layout="vertical" stackOffset="expand" accessibilityLayer>
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={110}
                />
                <XAxis
                  type="number"
                  tickFormatter={(value) => `${Math.round(Number(value) * 100)}%`}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => (
                        <span>
                          {config[String(name)]?.label}:{' '}
                          {formatShare(Number(value), preferences.total)}
                        </span>
                      )}
                    />
                  }
                />
                {PREFERENCE_SERIES.map((series) => (
                  <Bar
                    key={series.key}
                    isAnimationActive={false}
                    dataKey={series.key}
                    stackId="preferences"
                    fill={`var(--color-${series.key})`}
                  />
                ))}
              </BarChart>
            </ChartContainer>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {PREFERENCE_SERIES.map((series) => (
                <li key={series.key} className="flex items-center gap-1.5">
                  <span
                    aria-hidden
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: series.colour }}
                  />
                  {series.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Recipient({ recipient }: { recipient: AdminNotification['recipient'] }) {
  if (!recipient) {
    return <span className="text-muted-foreground">-</span>;
  }

  if (!recipient.username) {
    return <>{recipient.displayName}</>;
  }

  return (
    <Link to={`/u/${recipient.username}`} className="hover:underline">
      {recipient.displayName}
    </Link>
  );
}

export function NotificationsPage({
  stats,
  notifications,
  page,
  totalPages,
}: NotificationsPageProps) {
  const read = stats.read.find((row) => row.is_read)?.total ?? 0;
  const unread = stats.read.find((row) => !row.is_read)?.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Notifications</h1>
        <span className="text-sm text-muted-foreground">Total: {stats.total}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="min-w-0 md:col-span-2">
          <WeeklyCard weekly={stats.weekly} />
        </div>

        <div className="min-w-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Unsubscribed</CardTitle>
              <CardDescription>Members who have unsubscribed from notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <StatTile label="Members" value={stats.unsubscribed} />
            </CardContent>
          </Card>
        </div>

        <div className="min-w-0">
          <PieCard
            title="Read and unread"
            description="Every notification counted once."
            total={stats.total}
            slices={[
              { key: 'read', label: 'Read', value: read },
              { key: 'unread', label: 'Unread', value: unread },
            ]}
          />
        </div>

        <div className="min-w-0">
          <PieCard
            title="Notification type"
            description="Action and content type."
            total={stats.total}
            slices={stats.types.map((type) => ({
              key: `${type.action_type}-${type.content_type}`,
              label: typeLabel(type.action_type, type.content_type),
              value: type.total,
            }))}
          />
        </div>

        <div className="min-w-0">
          <PreferencesCard preferences={stats.preferences} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-base font-semibold">All notifications</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} variant="muted" className="h-24 text-center">
                  No notifications found.
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell variant="strong">
                    <Recipient recipient={notification.recipient} />
                  </TableCell>
                  <TableCell>{actionLabel(notification.actionType)}</TableCell>
                  <TableCell>{contentLabel(notification.contentType)}</TableCell>
                  <TableCell truncate className="max-w-xs">
                    {notification.title || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={notification.isRead ? 'default' : 'info'}>
                      {notification.isRead ? 'Read' : 'Unread'}
                    </Badge>
                  </TableCell>
                  <TableCell variant="muted">
                    {DATE_TIME_FORMAT.format(new Date(notification.createdAt))}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <AdminPagination page={page} totalPages={totalPages} />
      </div>
    </div>
  );
}
