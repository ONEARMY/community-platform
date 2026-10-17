import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';

interface IProps {
  page: number;
  totalPages: number;
}

export function AdminPagination({ page, totalPages }: IProps) {
  if (totalPages <= 1) {
    return null;
  }

  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        {hasPrevious ? (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link to={`?page=${page - 1}`} />}
          >
            <ChevronLeftIcon className="size-4 mr-1" />
            Previous
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ChevronLeftIcon className="size-4 mr-1" />
            Previous
          </Button>
        )}
        {hasNext ? (
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link to={`?page=${page + 1}`} />}
          >
            Next
            <ChevronRightIcon className="size-4 ml-1" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
            <ChevronRightIcon className="size-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}
