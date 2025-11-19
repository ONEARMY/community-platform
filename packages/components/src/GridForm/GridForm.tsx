import { Box, Flex, Grid, Text } from 'theme-ui';

import { Icon } from '../Icon/Icon';

import type { ReactNode } from 'react';
import type { availableGlyphs } from '../Icon/types';

export interface GridFormFields {
  glyph: availableGlyphs;
  name: string;
  description: string;
  component: ReactNode;
}

export interface IProps {
  fields: GridFormFields[];
  heading: string;
}

export const GridForm = ({ fields, heading }: IProps) => {
  return (
    <>
      <Grid columns={2} width="10%" sx={{ gap: 2, padding: 2 }}>
        <Box>
          <Flex>
            <Text as="h3">{heading}</Text>
          </Flex>
        </Box>
        <Box></Box>
      </Grid>
      {fields.map((field, index) => {
        return (
          <Grid
            key={index}
            gap={2}
            columns={[2, '80% 20%']}
            sx={{
              borderRadius: 1,
              background: index % 2 == 0 ? 'softblue' : 'white',
              padding: 4,
            }}
            data-cy={`field: ${field.name}`}
          >
            <Flex sx={{ gap: 2 }}>
              <Icon glyph={field.glyph} size={20} />
              <Box>
                <Text as="h4">{field.name}</Text>
                <Text sx={{ color: 'GrayText', fontSize: 2 }}>{field.description}</Text>
              </Box>
            </Flex>
            <Flex
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {field.component}
            </Flex>
          </Grid>
        );
      })}
    </>
  );
};
