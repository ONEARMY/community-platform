import arrayMutators from 'final-form-arrays';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Button, Loader } from 'oa-components';
import type { ProfileFormData } from 'oa-shared';
import { useContext, useMemo } from 'react';
import { Form } from 'react-final-form';
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog';
import { useToast } from 'src/common/Toast';
import { profileService } from 'src/services/profileService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import { isContactable } from 'src/utils/helpers';
import { Flex } from 'theme-ui';
import { TenantContext } from '../common/TenantContext';
import { ProfileTypeSection } from './content/sections/ProfileType.section';
import { PublicContactSection } from './content/sections/PublicContact.section';
import { UserImagesSection } from './content/sections/UserImages.section';
import { UserInfosSection } from './content/sections/UserInfos.section';
import { VisitorSection } from './content/sections/VisitorSection';
import { buttons } from './labels';

export const SettingsPageUserProfile = observer(() => {
  const toast = useToast();
  const tenantContext = useContext(TenantContext);
  const profileStore = useProfileStore();
  const { profile, profileTypes } = profileStore;

  if (!profile) {
    return null;
  }

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
        type: profile.type?.name || 'member',
        displayName: profile.displayName || '',
        about: profile.about || '',
        isContactable: isContactable(profile.isContactable),
        coverImages,
        photo: profile.photo ? toJS(profile.photo) : undefined,
        country: profile.country,
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
      render={({
        dirty,
        submitting,
        submitSucceeded,
        values,
        handleSubmit,
        invalid,
        errors,
        form,
      }) => {
        const isMember = !profileTypes?.find((x) => x.name === values.type)?.isSpace;

        return (
          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />
            {submitting && <Loader sx={{ alignSelf: 'center' }} />}
            <form id={formId} onSubmit={handleSubmit}>
              <Flex sx={{ flexDirection: 'column', gap: [4, 6] }}>
                <ProfileTypeSection profileTypes={profileTypes || []} />
                <UserInfosSection formValues={values} />
                <UserImagesSection isMemberProfile={isMember} values={values} form={form} />

                {!isMember && (
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
                )}

                {!tenantContext?.noMessaging && (
                  <PublicContactSection isContactable={values.isContactable} />
                )}
              </Flex>
            </form>

            <Button
              large
              form={formId}
              data-cy="save"
              title={invalid ? `Errors: ${Object.keys(errors || {})}` : 'Submit'}
              onClick={() => window.scrollTo(0, 0)}
              variant="primary"
              type="submit"
              disabled={submitting}
              sx={{ alignSelf: 'flex-start' }}
            >
              {buttons.save}
            </Button>
          </Flex>
        );
      }}
    />
  );
});
