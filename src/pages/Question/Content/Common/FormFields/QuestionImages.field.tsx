import styled from '@emotion/styled';
import { ImageInputDeleteImage, ImageInputWrapper } from 'oa-components';
import type { Image } from 'oa-shared';
import { Field } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { ImageInputField } from 'src/common/Form/ImageInput.field';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { fields } from 'src/pages/Question/labels';
import { COMPARISONS } from 'src/utils/comparisons';
import { Image as ImageComponent } from 'theme-ui';

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 6px;
`;

interface IProps {
  inputsAvailable: number;
  existingImages: Image[] | null;
  removeExistingImage: (index: number) => void;
}

export const QuestionImagesField = (props: IProps) => {
  return (
    <FormFieldWrapper
      htmlFor="images"
      text={fields.images.title}
      flexDirection="row"
      flexWrap="wrap"
    >
      {[...Array(props.inputsAvailable)].map((_, i) => (
        <ImageInputFieldWrapper key={`image-upload-${i}`} data-cy={`image-upload-${i}`}>
          <Field
            hasText={false}
            name={`images[${i}]`}
            component={ImageInputField}
            isEqual={COMPARISONS.image}
          />
        </ImageInputFieldWrapper>
      ))}
      {props.existingImages?.map((image, i) => (
        <ImageInputFieldWrapper key={`existing-image-${i}`} data-cy={`existing-image-${i}`}>
          <FieldContainer
            style={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <ImageInputWrapper hasUploadedImg={true}>
              <ImageComponent src={image.publicUrl} />
              <ImageInputDeleteImage onClick={() => props.removeExistingImage(i)} />
            </ImageInputWrapper>
          </FieldContainer>
        </ImageInputFieldWrapper>
      ))}
    </FormFieldWrapper>
  );
};
