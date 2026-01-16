import { useState, useCallback, useEffect } from 'react';
import { SearchField } from 'oa-components';
import { Box, Flex, Text } from 'theme-ui';

import { Icon } from 'oa-components';

interface CollapsibleSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  placeholder: string;
  dataCy: string;
  resultsText?: string;
}

export const CollapsibleSearch = (props: CollapsibleSearchProps) => {
  const { value, onChange, onSearch, onClear, placeholder, dataCy, resultsText } = props;
  const [isExpanded, setIsExpanded] = useState<boolean>(!!value);

  // Expand if value exists on mount or when value changes
  useEffect(() => {
    if (value) {
      setIsExpanded(true);
    }
  }, [value]);

  const handleSearchClick = useCallback(() => {
    if (isExpanded) {
      onSearch();
    } else {
      setIsExpanded(true);
    }
  }, [isExpanded, onSearch]);

  const handleClear = useCallback(() => {
    onClear();
    if (value === '') {
      setIsExpanded(false);
    }
  }, [value, onClear]);

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1, width: '100%' }}>
      <Flex sx={{ gap: 2, alignItems: 'center' }}>
        {!isExpanded ? (
          <Box
            onClick={() => setIsExpanded(true)}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
              border: '1px solid',
              borderColor: 'lightgrey',
              borderRadius: 1,
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'offWhite',
              },
            }}
          >
            <Icon glyph="search" size={20} />
          </Box>
        ) : (
          <Box sx={{ flex: 1 }}>
            <SearchField
              dataCy={dataCy}
              placeHolder={placeholder}
              value={value}
              onChange={onChange}
              onClickDelete={handleClear}
              onClickSearch={handleSearchClick}
              additionalStyle={{
                width: '100%',
              }}
            />
          </Box>
        )}
      </Flex>
      {resultsText && (
        <Flex
          sx={{
            fontSize: '14px',
            color: 'grey',
            gap: 1,
            alignItems: 'center',
          }}
        >
          <Text>{resultsText}</Text>
          {value && (
            <Text
              onClick={handleClear}
              sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
                color: 'black',
              }}
            >
              Clear
            </Text>
          )}
        </Flex>
      )}
    </Flex>
  );
};
