import { Field, useForm, useFormState } from 'react-final-form'
import styled from '@emotion/styled'
import { ImageInputDeleteImage, ImageInputWrapper } from 'oa-components'
import { FieldContainer } from 'src/common/Form/FieldContainer'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { COMPARISONS } from 'src/utils/comparisons'
import { Image as ImageComponent } from 'theme-ui'

import { intro } from '../../labels'

import type { ProjectFormData } from 'oa-shared'

const ImageInputFieldWrapper = styled.div`
  height: 200px;
  margin-right: 10px;
  margin-bottom: 6px;
`

export const LibraryCoverImageField = () => {
  const name = 'existingCoverImage'
  const state = useFormState<ProjectFormData>()
  const form = useForm<ProjectFormData>()

  return (
    <FormFieldWrapper htmlFor={name} text={intro.cover_image.title} required>
      {!state.values.existingCoverImage ? (
        <ImageInputFieldWrapper key="image-upload" data-cy="image-upload">
          <Field
            hasText={false}
            name="coverImage"
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
              <ImageComponent src={state.values.existingCoverImage.publicUrl} />
              <ImageInputDeleteImage
                onClick={() => {
                  form.change('existingCoverImage', null)
                }}
              />
            </ImageInputWrapper>
          </FieldContainer>
        </ImageInputFieldWrapper>
      )}
    </FormFieldWrapper>
  )
}
