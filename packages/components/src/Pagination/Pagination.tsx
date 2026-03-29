import { useEffect, useState } from 'react';
import { Box, Flex, Input, Text } from 'theme-ui';
import { useDebouncedCallback } from 'use-debounce';
import { PaginationIcons } from '../PaginationIcons/PaginationIcons';

export interface Props {
  page: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

export const Pagination = ({ totalPages, page, onPageChange }: Props) => {
  const [pageNumber, setPageNumber] = useState<number | undefined>(page + 1);

  const debouncedChange = useDebouncedCallback((value: number) => {
    onPageChange(value - 1);
  }, 500);

  const handlePageChange = (value?: number) => {
    if (value && value >= 1 && value <= totalPages && value !== page + 1) {
      debouncedChange(value);
    } else {
      debouncedChange.cancel();
    }
  };

  useEffect(() => {
    setPageNumber(page + 1);
  }, [page]);

  return (
    <Flex
      sx={{
        justifyContent: 'center',
        gap: 1,
      }}
      data-cy="pagination"
    >
      <PaginationIcons
        directionIcon="double-arrow-left"
        onClick={() => onPageChange(0)}
        title="First Page"
        ariaLabel="Go to first page"
        hidden={page === 0}
      />
      <>
        {page > 0 && (
          <Text
            sx={{
              display: ['flex', 'none'],
              alignItems: 'center',
              cursor: 'pointer',
              px: 2,
            }}
            hidden={page === 0}
            onClick={() => onPageChange(page - 1)}
          >
            PREV
          </Text>
        )}
        <Box sx={{ display: ['none', 'flex'] }}>
          <PaginationIcons
            directionIcon="chevron-left"
            onClick={() => onPageChange(page - 1)}
            hidden={page === 0}
            title="Previous Page"
            ariaLabel="Go to previous page"
          />
        </Box>
      </>

      {pageNumber !== totalPages && (
        <>
          <Input
            type="number"
            inputMode="numeric"
            min={1}
            max={totalPages}
            value={pageNumber}
            onChange={(ev) => {
              const value = parseInt(ev.target.value);
              if (!isNaN(value)) {
                setPageNumber(value);
                handlePageChange(value);
              } else {
                handlePageChange();
                setPageNumber(undefined);
              }
            }}
            aria-label="Enter page number"
            sx={{
              border: '2px solid black',
              maxWidth: '44px',
              maxHeight: '44px',
              appearance: 'textfield',
              MozAppearance: 'textfield',
              '&::-webkit-outer-spin-button': {
                WebkitAppearance: 'none',
              },
              '&::-webkit-inner-spin-button': {
                WebkitAppearance: 'none',
              },
              justifyItems: 'center',
              backgroundColor: 'white',
              fontSize: 3,
            }}
          />
          <Flex
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>{`of ${totalPages}`}</Text>
          </Flex>
        </>
      )}

      <>
        <Box sx={{ display: ['none', 'flex'] }}>
          <PaginationIcons
            directionIcon="chevron-right"
            onClick={() => onPageChange(page + 1)}
            hidden={page === totalPages - 1}
            title="Next Page"
            ariaLabel="Go to next page"
          />
        </Box>
        {page < totalPages - 1 && page >= 0 && (
          <Text
            sx={{
              display: ['flex', 'none'],
              alignItems: 'center',
              cursor: 'pointer',
              px: 2,
            }}
            hidden={page === totalPages - 1}
            onClick={() => onPageChange(page + 1)}
          >
            NEXT
          </Text>
        )}
      </>
      <PaginationIcons
        directionIcon="double-arrow-right"
        onClick={() => onPageChange(totalPages - 1)}
        title="Last Page"
        ariaLabel="Go to last page"
        hidden={page === totalPages - 1}
      />
    </Flex>
  );
};
