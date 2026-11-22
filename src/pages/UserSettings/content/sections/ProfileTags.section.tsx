import { useCallback } from 'react';
import { Field } from 'react-final-form';
import { ProfileTagsSelect } from 'src/common/Tags/ProfileTagsSelect';
import { fields } from 'src/pages/UserSettings/labels';
import { COMPARISONS } from 'src/utils/comparisons';
import { SettingsField } from '../elements';

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
    <SettingsField label={title} description={description} data-testid="ProfileTags">
      <Field name="tagIds" component={renderTagsSelect} isEqual={COMPARISONS.tags} />
    </SettingsField>
  );
};
