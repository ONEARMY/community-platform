import { Icon } from 'oa-components';
import { useState } from 'react';
import { Box, Card, Flex } from 'theme-ui';

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
          border: 'none',
          borderRadius: 1,
          bg: open ? 'softblue' : 'white',
          cursor: 'pointer',
          fontSize: 2,
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {value.toUpperCase()}
        <Icon glyph="chevron-down" size={10} />
      </Box>

      {open && (
        <>
          <Box onClick={() => setOpen(false)} sx={{ position: 'fixed', inset: 0, zIndex: 1 }} />
          <Card
            variant="primary"
            sx={{
              position: 'absolute',
              top: '100%',
              right: 0,
              mt: 1,
              zIndex: 2,
              py: 1,
              minWidth: 160,
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
                  fontSize: 1,
                  px: 3,
                  py: 2,
                  '&:hover': { bg: 'background' },
                }}
              >
                {c.label}
              </Box>
            ))}
          </Card>
        </>
      )}
    </Flex>
  );
};
