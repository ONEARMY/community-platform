import type { Category } from 'oa-shared';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
    <Alert variant="info">
      <AlertDescription
        className="text-left text-sm [&_ol]:mt-1 [&_ol]:mb-0"
        dangerouslySetInnerHTML={{ __html: guidance[label][type] }}
      />
    </Alert>
  );
};
