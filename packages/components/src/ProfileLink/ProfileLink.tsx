import type { ThemeUICSSObject } from 'theme-ui';
import { Box, Flex } from 'theme-ui';
import { Icon } from '../Icon/Icon';

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
      <a
        rel="noopener noreferrer"
        target="_blank"
        className={`ml-2`}
        color="black"
        data-cy="profile-website"
        href={props.url}
      >
        {props.url}
      </a>
    </Flex>
  );
};
