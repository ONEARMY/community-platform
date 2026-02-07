import type { ThemeUIStyleObject } from 'theme-ui';
import { Text } from 'theme-ui';

export interface ITag {
  label: string;
}

export interface Props {
  tag: ITag;
  sx?: ThemeUIStyleObject | undefined;
}

export const Tag = ({ tag, sx }: Props) => {
  if (!tag || !tag.label) return null;

  return (
    <Text
      sx={{
        fontSize: 1,
        color: 'blue',
        ...sx,
        '::before': {
          content: '"#"',
        },
      }}
    >
      {tag.label}
    </Text>
  );
};
