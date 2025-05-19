import { Field } from 'react-final-form'
import styled from '@emotion/styled'
import { ImageInputDeleteImage, ImageInputWrapper } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { COMPARISONS } from 'src/utils/comparisons'
import { Image as ImageComponent } from 'theme-ui'

import type { Image } from 'oa-shared'

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 6px;
`

interface IProps {
  label: string
  existingImage: Image | null
  remove: () => void
}

export const ResearchImageField = (props: IProps) => {
  return (
    <FormFieldWrapper
      htmlFor="image"
      text={props.label}
      flexDirection="row"
      flexWrap="wrap"
    >
      {!props.existingImage && (
        <ImageInputFieldWrapper key="image-upload" data-cy="image-upload">
          <Field
            hasText={false}
            name="image"
            component={ImageInputField}
            isEqual={COMPARISONS.image}
          />
        </ImageInputFieldWrapper>
      )}
      {props.existingImage && (
        <ImageInputFieldWrapper key="existing-image" data-cy="existing-image">
          <FieldContainer
            style={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <ImageInputWrapper hasUploadedImg={true}>
              <ImageComponent src={props.existingImage.publicUrl} />
              <ImageInputDeleteImage onClick={() => props.remove()} />
            </ImageInputWrapper>
          </FieldContainer>
        </ImageInputFieldWrapper>
      )}
    </FormFieldWrapper>
  )
}
