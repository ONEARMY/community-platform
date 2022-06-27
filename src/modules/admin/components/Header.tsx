import React, { useState } from 'react';
import { Box, Container, Flex, Image, Input, Text } from 'theme-ui';
import Search from '../../../assets/icons/icon-search.svg';

type Props = {
  total: number,
  onChange: (text: string) => void
}

function Header({ total, onChange }: Props) {
  const [searchTxt, setSearchTxt] = useState('');

  const handleChange = (val) => {
    setSearchTxt(val);
    if (val.length > 3) onChange(val);
    else onChange('');
  };

  return (
    <Container sx={{ my: 5, pb: 2, borderBottom: '2px solid' }}>
      <Flex sx={{ justifyContent: 'space-between' }}>
        <Flex>
          <Box>
            <Text sx={{ fontSize: '30px', fontWeight: '400' }}>
              Users{' '}
              <Text sx={{ fontSize: '18px', color: '#686868' }}>
                {total} Total
              </Text>
            </Text>
          </Box>
        </Flex>
        <Flex>
          <Flex
            sx={{
              alignItems: 'center',
              background: 'white',
              px: 2,
              borderRadius: '5px',
            }}
          >
            <Input
              sx={{ background: 'white', ml: 1, border: 'none' }}
              value={searchTxt}
              placeholder="Search"
              onChange={(e) => handleChange(e.target.value)}
            />
            <Image sx={{ width: 20, height: 20 }} src={Search} />
          </Flex>
        </Flex>
      </Flex>
    </Container>
  )
}

export default Header
