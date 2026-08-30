import { MemberBadge, MultipleImageInput, Stepper } from 'oa-components';
import type { OrganisationApplicationFormData, ProfileType } from 'oa-shared';
import { useContext, useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import { TextareaField } from 'src/common/Form/Textarea.field';
import { TextInputField } from 'src/common/Form/TextInput.field';
import { TenantContext } from 'src/pages/common/TenantContext';
import {
  MAX_ORGANISATION_COVER_IMAGES,
  ORGANISATION_DESCRIPTION_MAX_LENGTH,
  ORGANISATION_SIGNUP_STEPS,
  organisationActivityClause,
} from 'src/pages/SignUp/constants';
import { ProfileTypeRadioField } from 'src/pages/UserSettings/content/fields/ProfileTypeRadio.field';
import { profileService } from 'src/services/profileService';
import { storageService } from 'src/services/storageService';
import { useProfileStore } from 'src/stores/Profile/profile.store';
import {
  composeValidators,
  noSpecialCharacters,
  required,
  validateUrl,
} from 'src/utils/validators';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface IProps {
  profileTypes: ProfileType[];
}

const requiredImages = (value: unknown[] | undefined) =>
  value && value.filter(Boolean).length > 0 ? undefined : 'Required';

// Must have a stable identity: a new object on re-render makes
// react-final-form reinitialize and wipe every field (e.g. while uploading)
const initialValues: Partial<OrganisationApplicationFormData> = { coverImages: [] };

export const OrganisationApplicationForm = ({ profileTypes }: IProps) => {
  const navigate = useNavigate();
  const profileStore = useProfileStore();
  const tenantContext = useContext(TenantContext);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);

  const activityClause = organisationActivityClause(tenantContext?.organisationActivity);
  const siteName = tenantContext?.siteName ?? 'the community';

  const onSubmit = async (values: OrganisationApplicationFormData) => {
    setSubmitError(null);

    try {
      const profile = await profileService.applyAsOrganisation(values);
      profileStore.update(profile);
      navigate(`/u/${profile.username}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application');
    }
  };

  return (
    <Form<OrganisationApplicationFormData>
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, submitting, invalid, values, form }) => {
        const selectedType = profileTypes.find((type) => type.name === values.type);
        const coverImages = (values.coverImages || []).filter((img) => img);

        const handleFilesSelect = async (files: File[]) => {
          setCoverError(null);

          try {
            setIsUploading(true);
            const uploadedImages = [...coverImages];

            for (const file of files) {
              // No profile exists yet, so images go to the user's own storage
              // path (users/<auth-id>) rather than a profile folder
              uploadedImages.push(await storageService.imageUpload(null, 'profiles', file));
            }

            form.change('coverImages', uploadedImages);
          } catch (error) {
            console.error('Error uploading picture:', error);
            setCoverError(error instanceof Error ? error.message : 'Error uploading picture');
          } finally {
            setIsUploading(false);
          }
        };

        const handleImageDelete = (index: number) => {
          form.change(
            'coverImages',
            coverImages.filter((_, i) => i !== index),
          );
        };

        return (
          <form data-cy="organisation-application-form" onSubmit={handleSubmit}>
            <div className="mx-auto mt-10 mb-4 w-full max-w-[620px] px-2 md:mt-20">
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <div data-cy="organisation-application-badges" className="flex justify-center">
                    {profileTypes.map((profileType, index) => (
                      <MemberBadge
                        key={profileType.name}
                        size={60}
                        profileType={profileType}
                        sx={{ marginLeft: index === 0 ? 0 : '-12px' }}
                      />
                    ))}
                  </div>
                  <h1 className="text-2xl font-semibold">One last step!</h1>
                  <p className="text-muted-foreground">
                    This info will help us verify {activityClause}. It usually takes a day or two to
                    get approved.
                  </p>
                </div>

                <Card variant="outline">
                  <CardHeader className="gap-4">
                    <Stepper steps={ORGANISATION_SIGNUP_STEPS} activeStep={2} />
                    <div className="flex flex-col gap-1">
                      <h2 className="text-2xl font-semibold">Application form</h2>
                      <p className="text-sm text-muted-foreground">
                        This info will be then shown in your public profile.
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    {submitError && (
                      <div
                        className="w-full rounded-sm bg-destructive/10 px-3 py-2 text-sm text-destructive"
                        data-cy="TextNotification: failure"
                      >
                        {submitError}
                      </div>
                    )}

                    <div data-cy="FocusSection" className="flex flex-col gap-2">
                      <Label>
                        Your focus <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Not sure?{' '}
                        <a
                          href={tenantContext?.profileGuidelines}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-4"
                        >
                          Check out our guidelines.
                        </a>
                      </p>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        {profileTypes.map((profileType) => (
                          <ProfileTypeRadioField
                            key={profileType.name}
                            data-cy={profileType.name}
                            value={profileType}
                            name="type"
                            isSelected={values.type === profileType.name}
                            onChange={(value) => form.change('type', value)}
                            textLabel={profileType.displayName}
                            required
                          />
                        ))}
                      </div>
                      {selectedType?.description && (
                        <div
                          data-cy="type-description"
                          className="rounded-lg bg-accent/10 p-3 text-sm"
                        >
                          <span className="block font-bold">Definition:</span>
                          <span>{selectedType.description}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="username">
                        Username <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Your unique identifier. Used in your profile URL.
                      </p>
                      <Field
                        id="username"
                        data-cy="username"
                        name="username"
                        component={TextInputField}
                        placeholder="your username"
                        validate={composeValidators(required, noSpecialCharacters)}
                        validateFields={[]}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="displayName">
                        Display Name <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Shown on your profile page. You can use spaces and everything!
                      </p>
                      <Field
                        id="displayName"
                        data-cy="displayName"
                        name="displayName"
                        component={TextInputField}
                        placeholder="Pick a name to display on your profile"
                        validate={required}
                        validateFields={[]}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="about">
                        Tell us a bit about your organisation{' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Describe your organisation and why you want to join {siteName}.
                      </p>
                      <Field
                        id="about"
                        data-cy="about"
                        name="about"
                        component={TextareaField}
                        showCharacterCount
                        maxLength={ORGANISATION_DESCRIPTION_MAX_LENGTH}
                        placeholder="Write description..."
                        validate={required}
                        validateFields={[]}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="website">Website or social media</Label>
                      <p className="text-sm text-muted-foreground">
                        In case you have some online presence, link it here.
                      </p>
                      <Field
                        id="website"
                        data-cy="website"
                        name="website"
                        component={TextInputField}
                        placeholder="https://"
                        validate={validateUrl}
                        validateFields={[]}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label>
                        Upload pictures of your workspace{' '}
                        <span className="text-destructive">*</span>
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        They help us to evaluate {activityClause}.
                      </p>
                      {coverError && (
                        <p data-cy="cover-error" className="text-sm text-destructive">
                          {coverError}
                        </p>
                      )}
                      <Field name="coverImages" validate={requiredImages} validateFields={[]}>
                        {() => (
                          <div data-cy="coverImages">
                            <MultipleImageInput
                              images={coverImages}
                              maxImages={MAX_ORGANISATION_COVER_IMAGES}
                              buttonLabel={`Upload 1-${MAX_ORGANISATION_COVER_IMAGES} pictures`}
                              isUploading={isUploading}
                              onFilesSelect={handleFilesSelect}
                              onDelete={handleImageDelete}
                              onError={setCoverError}
                            />
                          </div>
                        )}
                      </Field>
                    </div>

                    <Button
                      data-cy="submit"
                      size="lg"
                      className="w-full justify-center"
                      disabled={invalid || submitting || isUploading}
                      type="submit"
                    >
                      Send application and create account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        );
      }}
    />
  );
};
