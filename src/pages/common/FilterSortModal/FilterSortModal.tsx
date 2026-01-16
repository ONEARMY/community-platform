import { useCallback, useEffect, useState } from 'react';
import { Button, Modal } from 'oa-components';
import { Flex, Text } from 'theme-ui';

import { Icon } from 'oa-components';

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

  // Update temp values when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setTempFilterValue(selectedFilterValue || '');
      setTempSortValue(selectedSortValue);
    }
  }, [isOpen, selectedFilterValue, selectedSortValue]);

  const handleApply = useCallback(() => {
    if (onFilterChange && tempFilterValue !== selectedFilterValue) {
      onFilterChange(tempFilterValue);
    }
    if (tempSortValue !== selectedSortValue) {
      onSortChange(tempSortValue);
    }
    onApply();
  }, [tempFilterValue, tempSortValue, selectedFilterValue, selectedSortValue, onFilterChange, onSortChange, onApply]);

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

  return (
    <Modal
      isOpen={isOpen}
      onDidDismiss={onClose}
      sx={{
        '& > div': {
          // Override modal content styles for mobile bottom sheet
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          top: 'auto',
          transform: 'none',
          width: '100%',
          maxWidth: '100%',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          maxHeight: '80vh',
          overflowY: 'auto',
        },
      }}
    >
      <Flex
        sx={{
          flexDirection: 'column',
          gap: 3,
          padding: 0,
        }}
      >
        {/* Header */}
        <Flex
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 3,
            borderBottom: '1px solid',
            borderColor: 'lightgrey',
          }}
        >
          <Text
            sx={{
              fontWeight: 'bold',
              fontSize: '20px',
              color: 'black',
            }}
          >
            {title}
          </Text>
          <Icon
            glyph="close"
            size={20}
            onClick={onClose}
            sx={{
              cursor: 'pointer',
              color: 'grey',
              '&:hover': {
                color: 'black',
              },
            }}
          />
        </Flex>

        {/* Content */}
        <Flex
          sx={{
            flexDirection: 'column',
            gap: 4,
            paddingX: 3,
            paddingBottom: 3,
          }}
        >
          {/* Filter Section (if provided) */}
          {filterOptions && onFilterChange && (
            <>
              <Flex sx={{ flexDirection: 'column', gap: 2 }}>
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
                        <Icon
                          glyph="check"
                          size={20}
                          sx={{
                            color: 'accent.base',
                          }}
                        />
                      )}
                    </Flex>
                  ))}
                </Flex>
              </Flex>
              {/* Divider */}
              <Flex
                sx={{
                  height: '1px',
                  backgroundColor: 'lightgrey',
                }}
              />
            </>
          )}

          {/* Sort Section */}
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
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
                    <Icon
                      glyph="check"
                      size={20}
                      sx={{
                        color: 'accent.base',
                      }}
                    />
                  )}
                </Flex>
              ))}
            </Flex>
          </Flex>
        </Flex>

        {/* Footer Buttons */}
        <Flex
          sx={{
            gap: 2,
            padding: 3,
            borderTop: '1px solid',
            borderColor: 'lightgrey',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            sx={{
              flex: 1,
              borderColor: 'black',
            }}
          >
            Reset
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleApply}
            sx={{
              flex: 1,
            }}
          >
            Apply
          </Button>
        </Flex>
      </Flex>
    </Modal>
  );
};
