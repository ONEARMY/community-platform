import { getCountryDataList, getEmojiFlag } from 'countries-list';
import { observer } from 'mobx-react';
import { UserRole } from 'oa-shared';
import { Field } from 'react-final-form';
import { SelectField } from 'src/common/Form/Select.field';
import { TextareaField } from 'src/common/Form/Textarea.field';
import { TextInputField } from 'src/common/Form/TextInput.field';
import { fields } from 'src/pages/UserSettings/labels';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { composeValidators, noSpecialCharacters, required } from 'src/utils/validators';
import {
  GROUP_PROFILE_DESCRIPTION_MAX_LENGTH,
  MEMBER_PROFILE_DESCRIPTION_MAX_LENGTH,
} from '../../constants';
import { SettingsField } from '../elements';
import { CoverImagesField } from '../fields/CoverImages.field';
import { ProfileAvatarField } from '../fields/ProfileAvatar.field';

const countryOptions = getCountryDataList().map((country) => ({
  label: `${getEmojiFlag(country.iso2)} ${country.native}`,
  value: country.iso2,
}));

export const UserInfosSection = observer(() => {
  const { profile, isUserAuthorized } = useProfileStore();

  if (!profile) {
    return null;
  }

  const isMemberProfile = !profile.type?.isSpace;
  const isUsernameLocked = !!profile.username && !isUserAuthorized(UserRole.ADMIN);
  const { about, country, displayName, userName } = fields;

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
        <ProfileAvatarField profileId={profile.id} displayName={profile.displayName || ''} />
        <div className="flex flex-1 flex-col gap-5">
          <SettingsField
            label={displayName.title}
            description={displayName.description}
            htmlFor="displayName"
            required
          >
            <Field
              id="displayName"
              data-cy="displayName"
              name="displayName"
              component={TextInputField}
              variant="filled"
              placeholder="Pick a name to display on your profile"
              validate={required}
              validateFields={[]}
            />
          </SettingsField>
          <SettingsField
            label={userName.title}
            description={userName.description}
            htmlFor="username"
            required
          >
            <Field
              id="username"
              data-cy="username"
              name="username"
              component={TextInputField}
              variant="filled"
              placeholder="your username"
              disabled={isUsernameLocked}
              validate={composeValidators(required, noSpecialCharacters)}
              validateFields={[]}
            />
          </SettingsField>
        </div>
      </div>

      {!isMemberProfile && <CoverImagesField profileId={profile.id} />}

      <SettingsField label={country.title}>
        <Field data-cy="country-dropdown" name="country">
          {(field) => (
            <SelectField options={countryOptions} placeholder="Select your country..." {...field} />
          )}
        </Field>
      </SettingsField>

      <SettingsField label={about.title} htmlFor="about" required>
        <Field
          id="about"
          data-cy="info-about"
          name="about"
          component={TextareaField}
          variant="filled"
          rows={5}
          showCharacterCount
          maxLength={
            isMemberProfile
              ? MEMBER_PROFILE_DESCRIPTION_MAX_LENGTH
              : GROUP_PROFILE_DESCRIPTION_MAX_LENGTH
          }
          placeholder={about.placeholder}
          validate={required}
          validateFields={[]}
        />
      </SettingsField>
    </>
  );
});
