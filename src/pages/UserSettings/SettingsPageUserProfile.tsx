import arrayMutators from 'final-form-arrays';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import type { ProfileFormData } from 'oa-shared';
import { useContext, useMemo } from 'react';
import { Field, Form } from 'react-final-form';
import { TextInputField } from 'src/common/Form/TextInput.field';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { useToast } from 'src/common/Toast';
import { profileService } from 'src/services/profileService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { isContactable } from 'src/utils/helpers';
import { validateUrl } from 'src/utils/validators';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { TenantContext } from '../common/TenantContext';
import { SettingsCardHeading, SettingsField } from './content/elements';
import { FocusSection } from './content/sections/Focus.section';
import { ProfileTags } from './content/sections/ProfileTags.section';
import { PublicContactSection } from './content/sections/PublicContact.section';
import { UserInfosSection } from './content/sections/UserInfos.section';
import { VisitorSection } from './content/sections/VisitorSection';
import { buttons, fields, headings } from './labels';

export const SettingsPageUserProfile = observer(() => {
  const toast = useToast();
  const tenantContext = useContext(TenantContext);
  const profileStore = useProfileStore();
  const { profile } = profileStore;

  if (!profile) {
    return null;
  }

  const isMember = !profile.type?.isSpace;
  const needsResend = profile.moderation === 'improvements-needed';

  const saveProfile = async (values: ProfileFormData) => {
    values.coverImages = values.coverImages?.filter((cover) => !!cover) || [];

    if (values.username && values.username !== profile?.username) {
      const usernamePromise = profileService.updateUsername(values.username);
      toast.promise(usernamePromise, {
        loading: 'Updating username...',
        success: (usernameResult) => {
          profileStore.update(usernameResult);
          return 'Username updated!';
        },
        error: (error) => `Error: ${error.message}`,
      });
    }

    const profilePromise = profileService.update(values);

    toast.promise(profilePromise, {
      loading: 'Updating profile...',
      success: (updatedProfile) => {
        profileStore.update(updatedProfile);
        profileStore.refresh();
        return 'Profile updated!';
      },
      error: (error) => `Error: ${error.message}`,
    });
  };

  const coverImages = profile.coverImages
    ? profile.coverImages?.slice(0, 4).map((image) => toJS(image))
    : [];

  const initialValues = useMemo<ProfileFormData>(
    () =>
      ({
        username: profile.username || '',
        displayName: profile.displayName || '',
        about: profile.about || '',
        isContactable: isContactable(profile.isContactable),
        coverImages,
        photo: profile.photo ? toJS(profile.photo) : undefined,
        country: profile.country || '',
        showVisitorPolicy: !!profile.visitorPolicy,
        visitorPreferencePolicy: profile.visitorPolicy?.policy || 'open',
        visitorPreferenceDetails: profile.visitorPolicy?.details,
        website: profile.website || '',
        tagIds: profile.tags?.map((x) => x.id) || null,
      }) satisfies ProfileFormData,
    [],
  );

  const formId = 'userProfileForm';

  return (
    <Form
      id={formId}
      onSubmit={async (values) => await saveProfile(values)}
      initialValues={initialValues}
      mutators={{ ...arrayMutators }}
      validateOnBlur
      render={({ dirty, submitting, submitSucceeded, values, handleSubmit, invalid, errors }) => (
        <div className="flex flex-col gap-4 sm:gap-6">
          <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />
          {submitting && <Spinner />}
          <FocusSection />
          <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
            <Card variant="panel" data-testid="UserInfosSection" className="-mx-2 sm:mx-0">
              <SettingsCardHeading>{headings.infos}</SettingsCardHeading>
              <UserInfosSection />
              {!tenantContext?.noMessaging && (
                <PublicContactSection isContactable={values.isContactable} />
              )}
            </Card>

            <Card variant="panel" className="-mx-2 sm:mx-0">
              <SettingsCardHeading>
                {headings.community(tenantContext?.siteName || 'the platform')}
              </SettingsCardHeading>
              <ProfileTags typeName={profile.type?.name || ''} />
              {!isMember && (
                <>
                  <SettingsField label={fields.website.title} htmlFor="website">
                    <Field
                      id="website"
                      data-cy="website"
                      name="website"
                      component={TextInputField}
                      variant="filled"
                      placeholder="https://"
                      validate={validateUrl}
                      validateFields={[]}
                    />
                  </SettingsField>
                  <VisitorSection
                    visitorPolicy={
                      values.showVisitorPolicy
                        ? {
                            policy: values.visitorPreferencePolicy,
                            details: values.visitorPreferenceDetails,
                          }
                        : undefined
                    }
                  />
                </>
              )}
            </Card>
          </form>

          <Button
            size="lg"
            form={formId}
            data-cy="save"
            title={invalid ? `Errors: ${Object.keys(errors || {})}` : 'Submit'}
            onClick={() => window.scrollTo(0, 0)}
            type="submit"
            disabled={submitting}
            className="self-start"
          >
            {needsResend ? buttons.saveAndResend : buttons.save}
          </Button>
        </div>
      )}
    />
  );
});
