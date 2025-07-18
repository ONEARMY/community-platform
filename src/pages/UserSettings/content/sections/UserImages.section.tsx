import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { ImageInputDeleteImage, ImageInputWrapper } from 'oa-components'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
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
            <Field hasText={false} name="photo" component={ImageInputField} />
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

          <FieldArray name="coverImages" initialValue={values.coverImages}>
            {({ fields, meta }) => {
              return (
                <>
                  {meta.error && (
                    <Text sx={{ fontSize: 1, color: 'error' }}>
                      {meta.error}
                    </Text>
                  )}

                  <Flex
                    sx={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      gap: 2,
                    }}
                  >
                    {fields.map((name, index: number) => (
                      <Box
                        key={name}
                        sx={{
                          height: '100px',
                          width: '150px',
                        }}
                        data-cy="cover-image"
                        data-testid="cover-image"
                      >
                        <Field
                          hasText={false}
                          name={name}
                          validateFields={[]}
                          data-cy={`coverImages-${index}`}
                          component={ImageInputField}
                        />
                      </Box>
                    ))}
                  </Flex>
                </>
              )
            }}
          </FieldArray>
        </Flex>
      )}
    </Flex>
  )
}
