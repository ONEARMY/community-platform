import type { Category } from 'oa-shared';
import { Alert, Text } from 'theme-ui';
import { guidance } from '../../labels';

interface IProps {
  category?: Category;
  type: 'main' | 'files';
}

export const LibraryCategoryGuidance = ({ category, type }: IProps) => {
  if (!category) {
    return null;
  }

  const label = category.name.toLowerCase();
  const labelExists = !!guidance[label] && !!guidance[label][type];

  if (!labelExists) {
    return null;
  }

  return (
    <Alert variant="info" marginY={2}>
      <Text
        dangerouslySetInnerHTML={{ __html: guidance[label][type] }}
        sx={{
          fontSize: 1,
          textAlign: 'left',
        }}
      />
    </Alert>
  );
};
