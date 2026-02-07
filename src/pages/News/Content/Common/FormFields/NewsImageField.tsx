import styled from '@emotion/styled';
import { ImageInputDeleteImage, ImageInputWrapper } from 'oa-components';
import type { Image } from 'oa-shared';
import { Field } from 'react-final-form';
import { FieldContainer } from 'src/common/Form/FieldContainer';
import { ImageInputField } from 'src/common/Form/ImageInput.field';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { fields } from 'src/pages/News/labels';
import { COMPARISONS } from 'src/utils/comparisons';
import { Image as ImageComponent } from 'theme-ui';

const ImageInputFieldWrapper = styled.div`
  width: 620px;
  height: 310px;
`;

interface IProps {
  existingHeroImage: Image | null;
  removeExistingImage: () => void;
}

export const NewsImageField = (props: IProps) => {
  const { existingHeroImage, removeExistingImage } = props;

  return (
    <FormFieldWrapper
      description={fields.heroImage.description}
      htmlFor="images"
      text={fields.heroImage.title}
      flexDirection="row"
      flexWrap="wrap"
      required
    >
      {!existingHeroImage && (
        <ImageInputFieldWrapper data-cy="heroImage-upload">
          <Field
            hasText={false}
            name="heroImage"
            component={ImageInputField}
            isEqual={COMPARISONS.image}
            required
          />
        </ImageInputFieldWrapper>
      )}
      {existingHeroImage && (
        <ImageInputFieldWrapper key="existingHeroImage" data-cy="existingHeroImage">
          <FieldContainer
            style={{
              height: '100%',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <ImageInputWrapper hasUploadedImg={true}>
              <ImageComponent src={existingHeroImage.publicUrl} />
              <ImageInputDeleteImage onClick={() => removeExistingImage()} />
            </ImageInputWrapper>
          </FieldContainer>
        </ImageInputFieldWrapper>
      )}
    </FormFieldWrapper>
  );
};
