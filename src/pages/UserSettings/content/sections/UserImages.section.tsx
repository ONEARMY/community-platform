import { Field } from 'react-final-form'
import { ImageInputDeleteImage, ImageInputWrapper } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { ImageInputFieldV2 } from 'src/common/Form/ImageInputFieldV2'
import { fields, headings } from 'src/pages/UserSettings/labels'
import { Box, Flex, Heading, Image as ImageComponent, Text } from 'theme-ui'

import type { FormApi } from 'final-form'
import type { ProfileFormData } from 'oa-shared'

interface IProps {
  values: ProfileFormData
  isMemberProfile: boolean
  form: FormApi<ProfileFormData, Partial<ProfileFormData>>
}

export const UserImagesSection = ({
  isMemberProfile,
  values,
  form,
}: IProps) => {
  const numberOfImageInputsAvailable =
    4 - (values.existingCoverImages?.filter((x) => !!x)?.length || 0)

  return (
    <Flex sx={{ flexDirection: 'column', gap: 3 }}>
      <Heading as="h2">
        {isMemberProfile ? fields.userImage.title : headings.images} {' *'}
      </Heading>

      <Flex sx={{ flexDirection: 'column', alignContent: 'stretch', gap: 1 }}>
        {!isMemberProfile && (
          <Heading variant="subHeading">{fields.userImage.title}</Heading>
        )}
        <Text variant="paragraph">{fields.userImage.description}</Text>

        <Box
          data-testid="photo"
          sx={{
            width: '120px',
            height: '120px',
          }}
        >
          {!values.existingPhoto ? (
            <Field
              hasText={false}
              name="photo"
              render={({ input, meta }) => {
                return (
                  <ImageInputFieldV2
                    input={input}
                    meta={meta}
                    onFilesChange={(file) => input.onChange(file)}
                  />
                )
              }}
            />
          ) : (
            <ImageInputWrapper hasUploadedImg={true}>
              <ImageComponent src={values.existingPhoto?.publicUrl} />
              <ImageInputDeleteImage
                onClick={() => {
                  form.change('existingPhoto', undefined)
                }}
              />
            </ImageInputWrapper>
          )}
        </Box>
      </Flex>

      {!isMemberProfile && (
        <Flex sx={{ flexDirection: 'column', gap: 1 }}>
          <Heading variant="subHeading">{`${fields.coverImages.title} *`}</Heading>
          <Text variant="paragraph">{fields.coverImages.description}</Text>

          <Flex>
            <Field name="existingCoverImages">
              {({ input }) => (
                <Flex>
                  {values.existingCoverImages?.map((image, index) => (
                    <Box
                      sx={{
                        width: '150px',
                        height: '100px',
                        marginRight: '10px',
                      }}
                      key={`existing-image-${index}`}
                      data-cy={`existing-image-${index}`}
                      data-testid="coverImage"
                    >
                      <FieldContainer
                        style={{
                          height: '100%',
                          width: '100%',
                          overflow: 'hidden',
                        }}
                      >
                        <ImageInputWrapper hasUploadedImg={true}>
                          <ImageComponent src={image.publicUrl} />
                          <Field
                            name={`existingCoverImages[${index}]`}
                            render={() => (
                              <ImageInputDeleteImage
                                onClick={() => {
                                  const currentImages = input.value || []
                                  const updatedImages = currentImages.filter(
                                    (_, i) => i !== index,
                                  )
                                  input.onChange(updatedImages)
                                }}
                              />
                            )}
                          />
                        </ImageInputWrapper>
                      </FieldContainer>
                    </Box>
                  ))}
                </Flex>
              )}
            </Field>

            <Flex>
              {[...Array(numberOfImageInputsAvailable)].map((_, i) => (
                <Box
                  key={`coverImages${i}`}
                  sx={{
                    width: '150px',
                    height: '100px',
                    marginRight: '10px',
                  }}
                >
                  <Field
                    hasText={false}
                    name={`coverImages[${i}]`}
                    render={({ input, meta }) => {
                      return (
                        <ImageInputFieldV2
                          input={input}
                          meta={meta}
                          onFilesChange={(file) => input.onChange(file)}
                        />
                      )
                    }}
                  />
                </Box>
              ))}
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}
