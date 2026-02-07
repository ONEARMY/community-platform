import type { Profile, ProfileTag } from 'oa-shared';
import type { ComponentProps } from 'react';
import type { ThemeUIStyleObject } from 'theme-ui';
import { Flex, Text } from 'theme-ui';
import { visitorDisplayData } from '../VisitorModal/VisitorModal';

export interface IProps {
  tags: ProfileTag[] | null;
  visitorPolicy?: Profile['visitorPolicy'];
  isSpace: boolean;
  showVisitorModal?: () => void;
  sx?: ThemeUIStyleObject;
  large?: boolean;
}

const DEFAULT_COLOR = '#999999';

type TagProps = ComponentProps<typeof Text> & {
  label: string;
  large: IProps['large'];
  color?: string;
  dataCy?: string;
};

const Tag = ({ color, dataCy, label, large, onClick }: TagProps) => {
  const sizing = large
    ? {
        fontSize: 2,
        paddingX: 2,
        paddingY: '10px',
      }
    : {
        fontSize: 1,
        paddingX: '7.5px',
        paddingY: '5px',
      };
  return (
    <Text
      data-cy={dataCy}
      sx={{
        borderRadius: 99,
        border: '1px solid',
        borderColor: color,
        backgroundColor: `${color}20`,
        color: color,
        ...sizing,
        // Correction for misalignment due to \u24D8
        ...(large && !onClick ? { paddingTop: '12px' } : {}),
        ':hover': onClick
          ? {
              cursor: 'pointer',
            }
          : {},
      }}
      onClick={onClick}
    >
      {label}
    </Text>
  );
};

const policyColors = new Map([
  ['open', '#116503'],
  ['appointment', '#005471'],
  ['closed', DEFAULT_COLOR],
]);

export const ProfileTagsList = (props: IProps) => {
  const { tags, visitorPolicy, isSpace, showVisitorModal, sx, large } = props;
  const tagList = tags || [];

  return (
    <Flex
      data-cy="ProfileTagsList"
      data-testid="ProfileTagsList"
      sx={{ gap: 1, flexWrap: 'wrap', ...sx }}
    >
      {tagList.map(({ name }, index) => (
        <Tag key={index} color={DEFAULT_COLOR} label={name} large={large} />
      ))}
      {visitorPolicy && isSpace && (
        <Tag
          dataCy="tag-openToVisitors"
          color={policyColors.get(visitorPolicy.policy)}
          label={`${visitorDisplayData.get(visitorPolicy.policy)?.label} \u24D8`}
          onClick={() => {
            showVisitorModal && showVisitorModal();
          }}
          large={true}
        />
      )}
    </Flex>
  );
};
