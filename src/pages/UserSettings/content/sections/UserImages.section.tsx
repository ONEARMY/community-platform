import { Field } from 'react-final-form'
import { FieldArray } from 'react-final-form-arrays'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { fields, headings } from 'src/pages/UserSettings/labels'
import { Box, Flex, Heading, Text } from 'theme-ui'

import type { IUser } from 'src/models'
import type { IUploadedFileMeta } from 'src/stores/storage'

interface IProps {
  values: IUser
  isMemberProfile: boolean
}

export const UserImagesSection = ({ isMemberProfile, values }: IProps) => {
  const { coverImages, userImage } = values

  return (
    <Flex sx={{ flexDirection: 'column', gap: 3 }}>
      <Heading as="h2">
        {isMemberProfile ? fields.userImage.title : headings.images}
      </Heading>

      <Flex sx={{ flexDirection: 'column', alignContent: 'stretch', gap: 1 }}>
        {!isMemberProfile && (
          <Heading variant="subHeading">{fields.userImage.title}</Heading>
        )}
        <Text variant="paragraph">{fields.userImage.description}</Text>

        <Box
          data-testid="userImage"
          sx={{
            width: '120px',
            height: '120px',
          }}
        >
          <Field
            component={ImageInputField}
            data-cy="userImage"
            hasText={false}
            initialValue={userImage}
            name="userImage"
            validateFields={[]}
            imageDisplaySx={{
              borderRadius: '100%',
              objectFit: 'cover',
              width: '120px',
              height: '120px',
            }}
          />
        </Box>
      </Flex>

      {!isMemberProfile && (
        <Flex sx={{ flexDirection: 'column', gap: 1 }}>
          <Heading variant="subHeading">{`${fields.coverImages.title} *`}</Heading>
          <Text variant="paragraph">{fields.coverImages.description}</Text>

          <FieldArray
            name="coverImages"
            initialValue={coverImages as IUploadedFileMeta[]}
          >
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
