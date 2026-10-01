import { Link, useSearchParams } from 'react-router';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const PAGE_LINKS_EITHER_SIDE = 1;

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

function getPageItems(page: number, totalPages: number): PageItem[] {
  const start = Math.max(1, page - PAGE_LINKS_EITHER_SIDE);
  const end = Math.min(totalPages, page + PAGE_LINKS_EITHER_SIDE);
  const items: PageItem[] = [];

  if (start > 1) {
    items.push(1);
    if (start > 2) {
      items.push('ellipsis-start');
    }
  }

  for (let pageNumber = start; pageNumber <= end; pageNumber++) {
    items.push(pageNumber);
  }

  if (end < totalPages) {
    if (end < totalPages - 1) {
      items.push('ellipsis-end');
    }
    items.push(totalPages);
  }

  return items;
}

interface IProps {
  page: number;
  totalPages: number;
}

export function TablePagination({ page, totalPages }: IProps) {
  const [searchParams] = useSearchParams();
  const pageUrl = (value: number) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(value));
    return `?${nextParams}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious render={<Link to={pageUrl(page - 1)} />} />
          </PaginationItem>
        )}
        {getPageItems(page, totalPages).map((item) =>
          typeof item === 'number' ? (
            <PaginationItem key={item}>
              <PaginationLink isActive={item === page} render={<Link to={pageUrl(item)} />}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationEllipsis />
            </PaginationItem>
          ),
        )}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext render={<Link to={pageUrl(page + 1)} />} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
