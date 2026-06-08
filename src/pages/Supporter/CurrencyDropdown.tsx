import { Icon } from 'oa-components';
import { useState } from 'react';
import { Box, Flex } from 'theme-ui';

export const CurrencyDropdown = ({
  currencies,
  value,
  onChange,
}: {
  currencies: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Flex sx={{ justifyContent: 'flex-end', position: 'relative' }}>
      <Box
        as="button"
        onClick={() => setOpen(!open)}
        sx={{
          border: open ? '2px solid #E4E9EC' : 'none',
          borderBottom: 'none',
          borderRadius: open ? '5px 5px 0px 0px' : '5px',
          bg: open ? '#E4E9EC' : 'transparent',
          cursor: 'pointer',
          fontSize: '14px',
          fontFamily: 'body',
          px: '12px',
          py: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          position: 'relative',
          zIndex: 3,
        }}
      >
        {value.toUpperCase()}
        <Icon glyph="chevron-down" size={10} />
      </Box>

      {open && (
        <>
          <Box onClick={() => setOpen(false)} sx={{ position: 'fixed', inset: 0, zIndex: 1 }} />
          <Box
            sx={{
              position: 'absolute',
              top: 'calc(100% - 2px)',
              right: 0,
              zIndex: 2,
              py: '4px',
              width: '220px',
              bg: 'white',
              borderRadius: '5px 0px 5px 5px',
              border: '2px solid #E4E9EC',
              boxShadow: '0px 44px 54px rgba(0, 0, 0, 0.12)',
            }}
          >
            {currencies.map((c) => (
              <Box
                key={c.value}
                as="button"
                onClick={() => {
                  onChange(c.value);
                  setOpen(false);
                }}
                sx={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  bg: c.value === value ? 'background' : 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontFamily: 'body',
                  px: '16px',
                  py: '12px',
                  '&:hover': { bg: 'background' },
                }}
              >
                {c.label}
              </Box>
            ))}
          </Box>
        </>
      )}
    </Flex>
  );
};
