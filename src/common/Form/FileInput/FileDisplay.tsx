import { Icon } from 'oa-components';
import type { MediaFile } from 'oa-shared';
import { bytesToSize } from 'oa-shared';
import { Link } from 'react-router';
import { Flex, IconButton, Text } from 'theme-ui';

type FileDisplayProps = {
  file: MediaFile;
  onRemove: () => void;
};

export const FileDisplay = ({ file, onRemove }: FileDisplayProps) => {
  return (
    <Flex
      key={file.id}
      sx={{
        alignItems: 'center',
        gap: 2,
        background: 'background',
        borderRadius: 6,
        padding: 1,
      }}
    >
      <Icon size={24} glyph="download-cloud" sx={{ marginLeft: 1 }} />
      <Text
        sx={{
          flex: 1,
          fontSize: 1,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        }}
      >
        {file.url ? (
          <Link to={file.url} target="_blank">
            {file.name}
          </Link>
        ) : (
          file.name
        )}
      </Text>

      {file.size && <Text sx={{ fontSize: 1 }}>{bytesToSize(file.size)}</Text>}

      <IconButton
        onClick={onRemove}
        data-testid="remove-file"
        type="button"
        sx={{ ':hover': { cursor: 'pointer' } }}
      >
        <Icon size={16} glyph="close" />
      </IconButton>
    </Flex>
  );
};
