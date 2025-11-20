import { Field } from 'react-final-form';
import { UserRole } from 'oa-shared';
import { ClientOnly } from 'remix-utils/client-only';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { FileInputField } from 'src/common/Form/FileInput.field';
import { FormFieldWrapper } from 'src/pages/common/FormFields';
import { Text } from 'theme-ui';

import { intro } from '../../labels';

// TODO: Replicate research behavior
export const LibraryFileUploadField = () => {
  const { description, title } = intro.files;
  const name = 'files';

  return (
    <ClientOnly fallback={<></>}>
      {() => (
        <>
          <AuthWrapper
            roleRequired={UserRole.ADMIN}
            fallback={
              <FormFieldWrapper htmlFor={name} text={title}>
                <Field id={name} name={name} data-cy={name} component={FileInputField} />
                <Text color={'grey'} mt={4} sx={{ fontSize: 1 }}>
                  {description}
                </Text>
              </FormFieldWrapper>
            }
          >
            <FormFieldWrapper htmlFor={name} text={title}>
              <Field id={name} name={name} data-cy={name} admin={true} component={FileInputField} />
              <Text color={'grey'} mt={4} sx={{ fontSize: 1 }}>
                {'Maximum file size 300MB'}
              </Text>
            </FormFieldWrapper>
          </AuthWrapper>
        </>
      )}
    </ClientOnly>
  );
};
