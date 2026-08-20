import type { Supporter } from 'oa-shared';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface IProps {
  supporters: Supporter[];
}

export function SupportersPage({ supporters }: IProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Supporters</h1>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Display name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supporters.map((supporter) => (
            <TableRow key={supporter.profile_id}>
              <TableCell>{supporter.username}</TableCell>
              <TableCell>{supporter.display_name}</TableCell>
              <TableCell className="text-muted-foreground">{supporter.email}</TableCell>
              <TableCell>{supporter.tier_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
