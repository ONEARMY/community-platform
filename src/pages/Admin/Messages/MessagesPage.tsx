import { useState } from 'react';
import { Link } from 'react-router';
import { AdminPagination } from 'src/pages/Admin/AdminPagination';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeZone: 'UTC',
});

const DATE_TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'UTC',
});

interface MessageProfile {
  username: string | null;
  displayName: string;
}

export interface AdminMessage {
  id: number;
  message: string;
  createdAt: string;
  sender: MessageProfile | null;
  receiver: MessageProfile | null;
}

export interface MessagesPageProps {
  messages: AdminMessage[];
  page: number;
  totalPages: number;
  totalCount: number;
}

function ProfileName({ profile }: { profile: MessageProfile | null }) {
  if (!profile) {
    return <span className="text-muted-foreground">-</span>;
  }

  if (!profile.username) {
    return <>{profile.displayName}</>;
  }

  return (
    <Link to={`/u/${profile.username}`} className="hover:underline">
      {profile.displayName}
    </Link>
  );
}

export function MessagesPage({ messages, page, totalPages, totalCount }: MessagesPageProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = messages.find((message) => message.id === selectedId) ?? messages[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Messages</h1>
        <span className="text-sm text-muted-foreground">Total: {totalCount}</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4 lg:col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sender</TableHead>
                <TableHead>Receiver</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Sent</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} variant="muted" className="h-24 text-center">
                    No messages found.
                  </TableCell>
                </TableRow>
              ) : (
                messages.map((message) => (
                  <TableRow
                    key={message.id}
                    className="cursor-pointer"
                    data-state={message.id === selected?.id ? 'selected' : undefined}
                    onClick={() => setSelectedId(message.id)}
                  >
                    <TableCell variant="strong">
                      <ProfileName profile={message.sender} />
                    </TableCell>
                    <TableCell>
                      <ProfileName profile={message.receiver} />
                    </TableCell>
                    <TableCell truncate className="max-w-xs">
                      <button
                        type="button"
                        aria-pressed={message.id === selected?.id}
                        className="w-full truncate text-left"
                      >
                        {message.message}
                      </button>
                    </TableCell>
                    <TableCell variant="muted">
                      {DATE_FORMAT.format(new Date(message.createdAt))}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <AdminPagination page={page} totalPages={totalPages} />
        </div>

        {selected && (
          <Card className="h-fit" aria-label="Selected message">
            <CardHeader>
              <CardTitle>
                <span className="flex flex-wrap gap-1">
                  <ProfileName profile={selected.sender} />
                  <span className="text-muted-foreground">to</span>
                  <ProfileName profile={selected.receiver} />
                </span>
              </CardTitle>
              <CardDescription>
                {DATE_TIME_FORMAT.format(new Date(selected.createdAt))}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap wrap-break-word text-sm">{selected.message}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
