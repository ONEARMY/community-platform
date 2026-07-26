import { Button, Icon } from 'oa-components';
import { Flex, Text } from 'theme-ui';
import { REMAKE_IMAGE_ASPECT_RATIO } from './constants';

interface IProps {
  onUploadClick: () => void;
}

export const RemakeGhostCard = ({ onUploadClick }: IProps) => {
  return (
    <Flex data-cy="remake-ghost-card" sx={{ flexDirection: 'column', gap: 1 }}>
      <Flex
        sx={{
          position: 'relative',
          aspectRatio: REMAKE_IMAGE_ASPECT_RATIO,
          border: '2px dashed',
          borderColor: 'softgrey',
          borderRadius: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon glyph="add" size={52} color="darkGrey" />
        <Button
          type="button"
          variant="outline"
          data-cy="remake-ghost-upload"
          onClick={onUploadClick}
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            fontSize: 1,
            height: '32px',
          }}
        >
          Share your remake
        </Button>
      </Flex>
      <Text sx={{ fontFamily: 'title', fontSize: 2, color: 'darkGrey', textAlign: 'center' }}>
        Your remake here!
      </Text>
    </Flex>
  );
};
