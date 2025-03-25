import { Field } from 'react-final-form'
import styled from '@emotion/styled'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { DeleteImage } from 'src/common/Form/ImageInput/DeleteImage'
import { ImageInputWrapper } from 'src/common/Form/ImageInput/ImageInputWrapper'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { fields } from 'src/pages/News/labels'
import { COMPARISONS } from 'src/utils/comparisons'
import { Image as ImageComponent, Text } from 'theme-ui'

import type { Image } from 'oa-shared'

const ImageInputFieldWrapper = styled.div`
  width: 900px;
  height: 450px;
`

interface IProps {
  existingHeroImage: Image | null
  removeExistingImage: () => void
}

export const NewsImageField = (props: IProps) => {
  const { existingHeroImage } = props
  return (
    <FormFieldWrapper
      htmlFor="images"
      text={fields.heroImage.title}
      flexDirection="row"
      flexWrap="wrap"
      required
    >
      <Text variant='quiet' sx={{fontSize: 2}}>{fields.heroImage.description}</Text>
      {!existingHeroImage && (
        <ImageInputFieldWrapper data-cy={'heroImage-upload'}>
          <Field
            hasText={false}
            name={'heroImage'}
            component={ImageInputField}
            isEqual={COMPARISONS.image}
            required
          />
        </ImageInputFieldWrapper>
      )}
      {existingHeroImage && (
        <ImageInputFieldWrapper
          key={`existingHeroImage`}
          data-cy={`existingHeroImage`}
        >
          <FieldContainer
            style={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <ImageInputWrapper hasUploadedImg={true}>
              <ImageComponent src={existingHeroImage.publicUrl} />
              <DeleteImage onClick={() => props.removeExistingImage()} />
            </ImageInputWrapper>
          </FieldContainer>
        </ImageInputFieldWrapper>
      )}
    </FormFieldWrapper>
  )
}
