import { useCallback, useEffect, useRef, useState } from 'react';
import { SearchField } from 'oa-components';
import { Box, Flex, Text } from 'theme-ui';

interface CollapsibleSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  placeholder: string;
  dataCy: string;
  resultsText?: string;
  onExpandChange?: (isExpanded: boolean) => void;
}

export const CollapsibleSearch = (props: CollapsibleSearchProps) => {
  const { value, onChange, onSearch, onClear, placeholder, dataCy, resultsText, onExpandChange } = props;
  const [isExpanded, setIsExpanded] = useState<boolean>(!!value);
  const containerRef = useRef<HTMLDivElement>(null);

  // Expand if value exists on mount or when value changes
  useEffect(() => {
    if (value) {
      setIsExpanded(true);
    }
  }, [value]);

  // Notify parent when expansion state changes
  useEffect(() => {
    if (onExpandChange) {
      onExpandChange(isExpanded);
    }
  }, [isExpanded, onExpandChange]);

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

  const handleBlur = useCallback(() => {
    // Collapse search if it's empty when user clicks away
    if (!value || value.trim() === '') {
      setIsExpanded(false);
    }
  }, [value]);

  // Handle click outside to collapse search when empty
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isExpanded && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Collapse if search is empty when clicking outside
        if (!value || value.trim() === '') {
          setIsExpanded(false);
        }
      }
    };

    if (isExpanded) {
      // Add event listener with a small delay to avoid immediate collapse when expanding
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isExpanded, value]);

  return (
    <Flex ref={containerRef} sx={{ flexDirection: 'column', gap: 1, width: '100%', minWidth: 0 }}>
      <Flex sx={{ gap: 2, alignItems: 'center', width: '100%' }}>
        {!isExpanded ? (
          <Box
            onClick={() => setIsExpanded(true)}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              minWidth: '44px',
              minHeight: '44px',
              flexShrink: 0,
            }}
          >
            <Box
              as="svg"
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              sx={{
                display: 'block',
                flexShrink: 0,
              }}
            >
              <path
                d="M3.37305 2.4502C4.93512 0.804196 7.23317 0.179788 9.51953 0.424805C11.8073 0.670046 14.0356 1.78245 15.4307 3.54395H15.4316C17.5913 6.26446 16.842 10.3498 14.7822 13.1895L14.5693 13.4824L14.8555 13.7041C17.3138 15.6123 19.5246 17.831 21.4355 20.3066L21.4453 20.3184C21.7376 20.6688 21.6525 21.1124 21.3711 21.3984C21.2331 21.5386 21.0739 21.6093 20.9346 21.6133C20.8108 21.6168 20.6569 21.5696 20.499 21.377C18.5859 18.8538 16.3421 16.6092 13.8311 14.7061L13.5693 14.5078L13.3389 14.7422L13.3076 14.7725C9.95086 17.6254 4.70078 17.3608 1.95215 13.8652C-0.79174 10.3752 0.276531 5.46169 3.36328 2.46094L3.36816 2.45605L3.37305 2.4502ZM9.375 1.93555C7.53992 1.73957 5.63187 2.19076 4.35742 3.52734C2.203 5.58671 0.907576 8.92911 2.37988 11.8926L2.48242 12.0996H2.50781C4.42102 15.6432 8.88669 16.2295 11.9893 14.0215L11.9932 14.0186C13.3209 13.0466 14.4864 11.3881 15.0225 9.61133C15.5591 7.83239 15.482 5.86553 14.2119 4.34961L14.21 4.34766C13.0527 2.98504 11.2162 2.13218 9.375 1.93555Z"
                fill="#1B1B1B"
                stroke="black"
                strokeWidth="0.746496"
              />
            </Box>
          </Box>
        ) : (
          <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            <SearchField
              dataCy={dataCy}
              placeHolder={placeholder}
              value={value}
              onChange={onChange}
              onClickDelete={handleClear}
              onClickSearch={handleSearchClick}
              onBlur={handleBlur}
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
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Text>{resultsText}</Text>
          {value && (
            <Text
              onClick={handleClear}
              sx={{
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'black',
                marginLeft: 'auto',
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
