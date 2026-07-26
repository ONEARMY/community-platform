import {
  Button,
  FieldInput,
  FieldTextarea,
  MemberBadge,
  MultipleImageInput,
  Stepper,
  TextNotification,
} from 'oa-components';
import type { OrganisationApplicationFormData, ProfileType } from 'oa-shared';
import { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { useNavigate } from 'react-router';
import {
  MAX_ORGANISATION_COVER_IMAGES,
  ORGANISATION_DESCRIPTION_MAX_LENGTH,
  ORGANISATION_SIGNUP_STEPS,
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
import { Box, Card, Flex, Grid, Heading, Text } from 'theme-ui';

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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);

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
            <Flex
              bg="inherit"
              px={2}
              sx={{ width: '100%', maxWidth: '620px' }}
              mx="auto"
              mt={[5, 10]}
              mb={3}
            >
              <Flex sx={{ flexDirection: 'column', width: '100%', gap: 3 }}>
                <Flex
                  sx={{
                    flexDirection: 'column',
                    gap: 2,
                    textAlign: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Flex data-cy="organisation-application-badges" sx={{ justifyContent: 'center' }}>
                    {profileTypes.map((profileType, index) => (
                      <MemberBadge
                        key={profileType.name}
                        size={60}
                        profileType={profileType}
                        sx={{ marginLeft: index === 0 ? 0 : '-12px' }}
                      />
                    ))}
                  </Flex>
                  <Heading>One last step!</Heading>
                  <Text color="grey" sx={{ fontSize: 2 }}>
                    This info will help us verify your organisation.
                    <br />
                    It usually takes a day or two to get approved.
                  </Text>
                </Flex>
                <Card sx={{ borderRadius: 3 }}>
                  <Flex
                    sx={{
                      flexWrap: 'wrap',
                      flexDirection: 'column',
                      padding: 4,
                      gap: 4,
                      width: '100%',
                    }}
                  >
                    <Stepper steps={ORGANISATION_SIGNUP_STEPS} activeStep={2} />

                    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                      <Heading>Application form</Heading>
                      <Text color="grey" sx={{ fontSize: 1 }}>
                        This info will be then shown in your public profile.
                      </Text>
                    </Flex>

                    {submitError && (
                      <TextNotification variant="failure" isVisible>
                        {submitError}
                      </TextNotification>
                    )}

                    <Flex data-cy="FocusSection" sx={{ flexDirection: 'column', gap: 2 }}>
                      <Text>
                        Your focus <Text color="red">*</Text>
                      </Text>
                      <Grid columns={[2, 4]} gap={2}>
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
                      </Grid>
                      {selectedType?.description && (
                        <Box
                          data-cy="type-description"
                          sx={{
                            backgroundColor: 'softblue',
                            borderRadius: 2,
                            padding: 3,
                            fontSize: 1,
                          }}
                        >
                          <Text sx={{ fontWeight: 'bold', display: 'block' }}>Definition:</Text>
                          <Text>{selectedType.description}</Text>
                        </Box>
                      )}
                    </Flex>

                    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                      <Text>
                        Username <Text color="red">*</Text>
                      </Text>
                      <Text variant="quiet" sx={{ fontSize: 1 }}>
                        Your unique identifier. Used in your profile URL.
                      </Text>
                      <Field
                        data-cy="username"
                        name="username"
                        component={FieldInput}
                        placeholder="your username"
                        validate={composeValidators(required, noSpecialCharacters)}
                        validateFields={[]}
                      />
                    </Flex>

                    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                      <Text>
                        Display Name <Text color="red">*</Text>
                      </Text>
                      <Text variant="quiet" sx={{ fontSize: 1 }}>
                        Shown on your profile page. You can use spaces and everything!
                      </Text>
                      <Field
                        data-cy="displayName"
                        name="displayName"
                        component={FieldInput}
                        placeholder="Pick a name to display on your profile"
                        validate={required}
                        validateFields={[]}
                      />
                    </Flex>

                    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                      <Text>
                        Tell us a bit about your organisation <Text color="red">*</Text>
                      </Text>
                      <Field
                        data-cy="about"
                        name="about"
                        component={FieldTextarea}
                        showCharacterCount
                        maxLength={ORGANISATION_DESCRIPTION_MAX_LENGTH}
                        placeholder="Write description..."
                        validate={required}
                        validateFields={[]}
                      />
                    </Flex>

                    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                      <Text>Website or social media</Text>
                      <Text variant="quiet" sx={{ fontSize: 1 }}>
                        In case you have some online presence, link it here.
                      </Text>
                      <Field
                        data-cy="website"
                        name="website"
                        component={FieldInput}
                        placeholder="https://"
                        validate={validateUrl}
                        validateFields={[]}
                      />
                    </Flex>

                    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
                      <Text>
                        Upload pictures of your workspace <Text color="red">*</Text>
                      </Text>
                      <Text variant="quiet" sx={{ fontSize: 1 }}>
                        They help us to evaluate your organisation. Upload 1-
                        {MAX_ORGANISATION_COVER_IMAGES} pictures.
                      </Text>
                      {coverError && (
                        <Text data-cy="cover-error" sx={{ color: 'error', fontSize: 1 }}>
                          {coverError}
                        </Text>
                      )}
                      <Field name="coverImages" validate={requiredImages} validateFields={[]}>
                        {() => (
                          <Box data-cy="coverImages">
                            <MultipleImageInput
                              images={coverImages}
                              maxImages={MAX_ORGANISATION_COVER_IMAGES}
                              buttonLabel={`Upload 1-${MAX_ORGANISATION_COVER_IMAGES} pictures`}
                              isUploading={isUploading}
                              onFilesSelect={handleFilesSelect}
                              onDelete={handleImageDelete}
                              onError={setCoverError}
                            />
                          </Box>
                        )}
                      </Field>
                    </Flex>

                    <Flex>
                      <Button
                        large
                        sx={{
                          borderRadius: 3,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                        data-cy="submit"
                        variant="primary"
                        disabled={invalid || submitting || isUploading}
                        type="submit"
                      >
                        Send application and create account
                      </Button>
                    </Flex>
                  </Flex>
                </Card>
              </Flex>
            </Flex>
          </form>
        );
      }}
    />
  );
};
