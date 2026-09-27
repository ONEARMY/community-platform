import { Icon } from 'oa-components';
import { Box, Text } from 'theme-ui';
import { REMAKE_IMAGE_ASPECT_RATIO } from './constants';

interface IProps {
  onUploadClick: () => void;
}

export const RemakeGhostCard = ({ onUploadClick }: IProps) => {
  return (
    <Box
      as="button"
      data-cy="remake-ghost-card"
      onClick={onUploadClick}
      sx={{
        aspectRatio: REMAKE_IMAGE_ASPECT_RATIO,
        alignSelf: 'start',
        width: '100%',
        padding: 0,
        backgroundColor: 'background',
        border: '2px solid transparent',
        borderRadius: 1,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        '&:hover': {
          borderColor: 'blue',
        },
      }}
    >
      <Icon glyph="add" size={52} color="darkGrey" />
      <Text as="span" sx={{ fontFamily: 'body', fontSize: 2 }}>
        Share your remake
      </Text>
    </Box>
  );
};
