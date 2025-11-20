import { useCallback } from 'react';
import { Field } from 'react-final-form';
import { ProfileTagsSelect } from 'src/common/Tags/ProfileTagsSelect';
import { fields } from 'src/pages/UserSettings/labels';
import { COMPARISONS } from 'src/utils/comparisons';
import { Flex, Text } from 'theme-ui';

import { FlexSectionContainer } from '../elements';

interface IProps {
  typeName: string | undefined;
}

export const ProfileTags = ({ typeName }: IProps) => {
  const { description, title } = fields.tags;

  const renderTagsSelect = useCallback(
    ({ input }) => (
      <ProfileTagsSelect
        value={input.value}
        onChange={(tags) => input.onChange(tags)}
        maxTotal={5}
        profileType={typeName}
        isForm
      />
    ),
    [typeName],
  );

  return (
    <FlexSectionContainer>
      <Flex
        data-testid="ProfileTags"
        sx={{
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Text>{title}</Text>
        <Text variant="quiet" sx={{ fontSize: 2 }}>
          {description}
        </Text>
        <Field name="tagIds" component={renderTagsSelect} isEqual={COMPARISONS.tags} />
      </Flex>
    </FlexSectionContainer>
  );
};
