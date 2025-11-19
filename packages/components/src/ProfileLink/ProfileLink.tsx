import { Box, Flex } from 'theme-ui';

import { ExternalLink } from '../ExternalLink/ExternalLink';
import { Icon } from '../Icon/Icon';

import type { ThemeUICSSObject } from 'theme-ui';

export interface Props {
  url: string;
  sx?: ThemeUICSSObject;
}

export const ProfileLink = (props: Props) => {
  return (
    <Flex
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        mt: 0,
        ...props.sx,
      }}
    >
      <Box>
        <Icon glyph="website" size={22} />
      </Box>
      <ExternalLink marginLeft={2} color="black" data-cy="profile-website" href={props.url}>
        {props.url}
      </ExternalLink>
    </Flex>
  );
};
