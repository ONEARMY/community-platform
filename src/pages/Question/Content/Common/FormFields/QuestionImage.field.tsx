import { Field } from 'react-final-form'
import styled from '@emotion/styled'
import { ImageInputField } from 'src/common/Form/ImageInput.field'
import { FormFieldWrapper } from 'src/pages/Howto/Content/Common'
import { fields } from 'src/pages/Question/labels'
import { COMPARISONS } from 'src/utils/comparisons'

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 6px;
`

interface IProps {
  inputsAvailable: number
}

export const QuestionImagesField = (props: IProps) => {
  return (
    <>
      <FormFieldWrapper
        htmlFor="images"
        text={fields.images.title}
        flexDirection='row'
        flexWrap='wrap'
      >
        {[...Array(props.inputsAvailable)].map((_, i) => (
          <ImageInputFieldWrapper
            key={`image-upload-${i}`}
            data-cy={`image-upload-${i}`}
          >
            <Field
              hasText={false}
              name={`images[${i}]`}
              component={ImageInputField}
              isEqual={COMPARISONS.image}
            />
          </ImageInputFieldWrapper>
        ))}
      </FormFieldWrapper>
    </>
  )
}