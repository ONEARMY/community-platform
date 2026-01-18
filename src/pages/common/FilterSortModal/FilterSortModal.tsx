import { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { Button, Modal } from 'oa-components';
import { Box, Flex, Text } from 'theme-ui';

const ScrollableContainer = styled.div`
  width: 340px;
  height: 394px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0;
  margin: 0;
  
  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 15px;
  }
  &::-webkit-scrollbar-track {
    background: #F4F6F7;
    border-left: 1px solid #F0F0F0;
  }
  &::-webkit-scrollbar-thumb {
    background: #CCCCCC;
    border-radius: 5px;
    min-height: 96px;
    border: 3px solid transparent;
    background-clip: padding-box;
  }
  
  /* Firefox scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: #CCCCCC #F4F6F7;
`;

export interface FilterOption {
  label: string;
  value: string;
}

export interface SortOption {
  label: string;
  value: string;
}

interface FilterSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  selectedFilterValue?: string;
  onFilterChange?: (value: string) => void;
  sortOptions: SortOption[];
  sortLabel: string;
  selectedSortValue: string;
  onSortChange: (value: string) => void;
  title?: string;
}

export const FilterSortModal = (props: FilterSortModalProps) => {
  const {
    isOpen,
    onClose,
    onApply,
    onReset,
    filterOptions,
    filterLabel = 'Status',
    selectedFilterValue,
    onFilterChange,
    sortOptions,
    sortLabel,
    selectedSortValue,
    onSortChange,
    title = 'Filter and sort',
  } = props;

  const [tempFilterValue, setTempFilterValue] = useState<string>(selectedFilterValue || '');
  const [tempSortValue, setTempSortValue] = useState<string>(selectedSortValue);
  const [dynamicTitle, setDynamicTitle] = useState<string>(title);
  const filterSectionRef = useRef<HTMLDivElement>(null);
  const sortSectionRef = useRef<HTMLDivElement>(null);
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  const titleElementRef = useRef<HTMLDivElement | null>(null);
  // Use ref instead of state to avoid re-renders during scroll
  const isScrolledRef = useRef<boolean>(false);

  // Update temp values when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setTempFilterValue(selectedFilterValue || '');
      setTempSortValue(selectedSortValue);
    }
  }, [isOpen, selectedFilterValue, selectedSortValue]);

  // Reset scroll state and title ONLY when modal first opens
  useEffect(() => {
    if (isOpen) {
      isScrolledRef.current = false;
      const initialTitle = filterOptions && onFilterChange ? 'Filter and sort' : title;
      setDynamicTitle(initialTitle);
      // Update title element directly if ref is available
      if (titleElementRef.current) {
        titleElementRef.current.textContent = initialTitle;
      }
    }
  }, [isOpen]); // Only depend on isOpen to prevent resets during scroll

  // Handle scroll to update title dynamically - update DOM directly to avoid re-renders
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!filterOptions || !onFilterChange) {
      return;
    }

    const target = e.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    const threshold = 60;

    // Update title directly via DOM without causing re-render (NO setState calls)
    if (scrollTop > threshold && !isScrolledRef.current) {
      isScrolledRef.current = true;
      if (titleElementRef.current) {
        titleElementRef.current.textContent = 'Sort';
      }
    } else if (scrollTop <= threshold && isScrolledRef.current) {
      isScrolledRef.current = false;
      if (titleElementRef.current) {
        titleElementRef.current.textContent = 'Filter and sort';
      }
    }
  };

  const handleApply = useCallback(() => {
    // Always apply filter when Apply is clicked to ensure URL is updated
    if (onFilterChange) {
      onFilterChange(tempFilterValue);
    }
    // Always apply sort when Apply is clicked
    if (onSortChange && tempSortValue !== selectedSortValue) {
      onSortChange(tempSortValue);
    }
    onApply();
  }, [tempFilterValue, tempSortValue, selectedSortValue, onFilterChange, onSortChange, onApply]);

  const handleReset = useCallback(() => {
    setTempFilterValue('');
    setTempSortValue(sortOptions[0]?.value || '');
    onReset();
  }, [sortOptions, onReset]);

  const handleFilterSelect = useCallback(
    (value: string) => {
      setTempFilterValue(value);
    },
    [],
  );

  const handleSortSelect = useCallback((value: string) => {
    setTempSortValue(value);
  }, []);

  if (!isOpen) {
    return null;
  }

  // Ensure we have sort options
  if (!sortOptions || sortOptions.length === 0) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onDidDismiss={onClose}
      width={340}
      height={516}
      sx={{
        // Override Modal's default centering and sizing
        // Use specific values to match Figma design
        position: 'fixed',
        left: '10px',
        top: '75px',
        right: 'auto',
        bottom: 'auto',
        transform: 'none',
        width: '340px',
        minWidth: '340px',
        maxWidth: '340px',
        height: '516px',
        minHeight: '516px',
        maxHeight: '516px',
        borderRadius: '10px',
        border: '2px solid black',
        padding: '0 !important', // Override Modal's default 16px padding
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        // Ensure these override styled component defaults
        '&': {
          width: '340px',
          maxWidth: '340px',
          padding: '0 !important',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Flex
          sx={{
            flexDirection: 'column',
            gap: 0,
            padding: 0,
            width: '100%',
            height: '100%',
          }}
        >
        {/* Header */}
        <Flex
          sx={{
            width: '340px',
            height: '58px',
            gap: '10px',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '15px',
            paddingRight: '10px',
            paddingBottom: '15px',
            paddingLeft: '48px',
            borderBottom: '2px solid',
            borderColor: 'black',
            position: 'relative',
          }}
        >
          <Box sx={{ width: '20px' }} /> {/* Spacer for centering */}
          <Text
            ref={(el) => {
              // Get the actual DOM element (Text might render as a div or span)
              if (el) {
                titleElementRef.current = el as HTMLDivElement;
              } else {
                titleElementRef.current = null;
              }
            }}
            sx={{
              width: '244px',
              height: '22px',
              fontFamily: 'Varela Round',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '100%',
              textAlign: 'center',
              color: 'black',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            {dynamicTitle}
          </Text>
          <Button
            variant="subtle"
            showIconOnly
            icon="close"
            small
            onClick={onClose}
            sx={{
              width: '28px',
              height: '28px',
              padding: '5px',
              minWidth: '28px',
              minHeight: '28px',
            }}
          />
        </Flex>

        {/* Content - Scrollable */}
        <ScrollableContainer
          ref={(el) => {
            scrollableContentRef.current = el;
          }}
          onScroll={handleScroll}
        >
          <Flex
            sx={{
              flexDirection: 'column',
              gap: 0,
            }}
          >
          {/* Filter Section (if provided) */}
          {filterOptions && onFilterChange && (
            <>
              <Box ref={filterSectionRef}>
                <Flex
                  sx={{
                    width: '340px',
                    flexDirection: 'column',
                    gap: 2,
                    paddingX: 3,
                    paddingTop: '15px',
                    paddingBottom: 3,
                  }}
                >
                <Text
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: 'black',
                  }}
                >
                  {filterLabel}
                </Text>
                <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                  {filterOptions.map((option) => (
                    <Flex
                      key={option.value}
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingY: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'offWhite',
                        },
                      }}
                      onClick={() => handleFilterSelect(option.value)}
                    >
                      <Text
                        sx={{
                          fontSize: '16px',
                          color: 'black',
                        }}
                      >
                        {option.label}
                      </Text>
                      {tempFilterValue === option.value && (
                        <Box
                          as="svg"
                          width="16"
                          height="15"
                          viewBox="0 0 16 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          sx={{
                            display: 'block',
                            flexShrink: 0,
                          }}
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.4124 0.236009C15.1106 0.681909 15.3151 1.60938 14.8692 2.30756L7.38463 14.0269C7.06627 14.5253 6.38717 14.6401 5.9227 14.2739L0.571333 10.0546C-0.0792065 9.54163 -0.190767 8.59846 0.322157 7.94792C0.83508 7.29738 1.77825 7.18582 2.42879 7.69874L6.04536 10.5503L12.3409 0.692812C12.7868 -0.00537381 13.7142 -0.209892 14.4124 0.236009Z"
                            fill="#00C3A9"
                          />
                        </Box>
                      )}
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              </Box>
              {/* Divider - Full width, no padding, grey color */}
              <Box
                sx={{
                  height: '2px',
                  backgroundColor: '#CCCCCC',
                  width: '100%',
                  flexShrink: 0,
                }}
              />
            </>
          )}

          {/* Sort Section */}
          <Flex
            ref={sortSectionRef}
            sx={{
              width: '340px',
              flexDirection: 'column',
              gap: 2,
              paddingX: 3,
              paddingY: 3,
            }}
          >
            <Text
              sx={{
                fontWeight: 'bold',
                fontSize: '16px',
                color: 'black',
              }}
            >
              {sortLabel}
            </Text>
            <Flex sx={{ flexDirection: 'column', gap: 1 }}>
              {sortOptions.map((option) => (
                <Flex
                  key={option.value}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingY: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'offWhite',
                    },
                  }}
                  onClick={() => handleSortSelect(option.value)}
                >
                  <Text
                    sx={{
                      fontSize: '16px',
                      color: 'black',
                    }}
                  >
                    {option.label}
                  </Text>
                  {tempSortValue === option.value && (
                    <Box
                      as="svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      sx={{
                        display: 'block',
                        flexShrink: 0,
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.4124 0.236009C15.1106 0.681909 15.3151 1.60938 14.8692 2.30756L7.38463 14.0269C7.06627 14.5253 6.38717 14.6401 5.9227 14.2739L0.571333 10.0546C-0.0792065 9.54163 -0.190767 8.59846 0.322157 7.94792C0.83508 7.29738 1.77825 7.18582 2.42879 7.69874L6.04536 10.5503L12.3409 0.692812C12.7868 -0.00537381 13.7142 -0.209892 14.4124 0.236009Z"
                        fill="#00C3A9"
                      />
                    </Box>
                  )}
                </Flex>
              ))}
            </Flex>
          </Flex>
          </Flex>
        </ScrollableContainer>

        {/* Footer Buttons */}
        <Flex
          sx={{
            width: '340px',
            height: '64px',
            gap: '20px',
            padding: '10px',
            borderTop: '2px solid',
            borderColor: 'black',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <Button
            type="button"
            variant="primary"
            onClick={handleApply}
            sx={{
              width: '150px',
              height: '44px',
              borderRadius: '5px',
              border: '2px solid black',
              paddingLeft: '15px',
              paddingRight: '15px',
              justifyContent: 'center',
              '& > *': {
                textAlign: 'center',
              },
            }}
          >
            Apply
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            sx={{
              width: '150px',
              height: '44px',
              borderRadius: '5px',
              border: 'none',
              paddingLeft: '15px',
              paddingRight: '15px',
              justifyContent: 'center',
              '& > *': {
                textAlign: 'center',
              },
            }}
          >
            Reset
          </Button>
        </Flex>
      </Flex>
      </Box>
    </Modal>
  );
};
