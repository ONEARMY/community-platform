import { Field, useForm, useFormState } from 'react-final-form'
import styled from '@emotion/styled'
import { ImageInputDeleteImage, ImageInputWrapper } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { COMPARISONS } from 'src/utils/comparisons'
import { Image as ImageComponent } from 'theme-ui'

import type { IImageForm } from 'oa-shared'

const ImageInputFieldWrapper = styled.div`
  height: 200px;
  width: 370px;
  max-width: 100%;
  margin-bottom: 6px;
`

type ImageFieldProps = {
  title: string
}

export const ImageField = (props: ImageFieldProps) => {
  const state = useFormState<IImageForm>()
  const form = useForm<IImageForm>()

  return (
    <FormFieldWrapper htmlFor="existingImage" text={props.title} required>
      {!state.values.existingImage ? (
        <ImageInputFieldWrapper key="image-upload" data-cy="image-upload">
          <Field
            hasText={false}
            name="image"
            component={ImageInputField}
            isEqual={COMPARISONS.image}
          />
        </ImageInputFieldWrapper>
      ) : (
        <ImageInputFieldWrapper key="existing-image" data-cy="existing-image">
          <FieldContainer
            style={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <ImageInputWrapper hasUploadedImg={true}>
              <ImageComponent src={state.values.existingImage?.publicUrl} />
              <ImageInputDeleteImage
                onClick={() => {
                  form.change('existingImage', null)
                }}
              />
            </ImageInputWrapper>
          </FieldContainer>
        </ImageInputFieldWrapper>
      )}
    </FormFieldWrapper>
  )
}
