import { Username } from 'oa-components';
import type { Remake } from 'oa-shared';
import { Box, Flex, Image } from 'theme-ui';
import { REMAKE_IMAGE_ASPECT_RATIO } from './constants';

interface IProps {
  remake: Remake;
  onClick: () => void;
}

export const RemakeCard = ({ remake, onClick }: IProps) => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
      <Box
        as="button"
        data-cy="remake-card"
        onClick={onClick}
        sx={{
          padding: 0,
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        <Image
          loading="lazy"
          src={remake.images[0]?.publicUrl}
          alt={`Remake by ${remake.author?.username || 'a community member'}`}
          sx={{
            width: '100%',
            aspectRatio: REMAKE_IMAGE_ASPECT_RATIO,
            objectFit: 'cover',
            borderRadius: 1,
            display: 'block',
          }}
        />
      </Box>
      {remake.author && <Username user={remake.author} />}
    </Flex>
  );
};
