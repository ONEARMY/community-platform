import { FieldInput } from 'oa-components';
import type { IFilesForm, MediaFile, ProjectFormData } from 'oa-shared';
import { UserRole } from 'oa-shared';
import { useState } from 'react';
import { Field, useForm, useFormState } from 'react-final-form';
import { ClientOnly } from 'remix-utils/client-only';
import { AuthWrapper } from 'src/common/AuthWrapper';
import { FileDisplay } from 'src/common/Form/FileInput/FileDisplay';
import { FileInputField } from 'src/common/Form/FileInput.field';
import { MAX_LINK_LENGTH } from 'src/pages/constants';
import { storageService } from 'src/services/storageService';
import { COMPARISONS } from 'src/utils/comparisons';
import { Flex, Label, Spinner, Text } from 'theme-ui';
import { fileLabels } from './labels';

interface FilesFieldsProps {
  contentType: 'projects' | 'research' | 'questions' | 'news';
  contentId?: number | null;
}

export const FilesFields = (props: FilesFieldsProps) => {
  const { contentType, contentId = null } = props;
  const state = useFormState<IFilesForm>();
  const form = useForm<ProjectFormData>();
  const hasBothError = !!(state.values?.files?.length && state.values.fileLink);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  return (
    <ClientOnly fallback={<></>}>
      {() => (
        <Flex sx={{ flexDirection: 'column', gap: 2 }}>
          <WarningMessages show={hasBothError} />
          <Label htmlFor="files">{fileLabels.files.title}</Label>
          {!!state.values.files?.length && (
            <AlreadyAddedFiles
              files={state.values.files || []}
              deleteFile={(id) => {
                form.change(
                  'files',
                  state.values.files?.filter((x) => x.id !== id),
                );
              }}
            />
          )}
          <UploadNewFiles
            contentType={contentType}
            contentId={contentId}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            uploadError={uploadError}
            setUploadError={setUploadError}
          />
        </Flex>
      )}
    </ClientOnly>
  );
};

const WarningMessages = ({ show }) => {
  const { error } = fileLabels.files;

  return (
    <Flex sx={{ mb: 2 }}>
      {show && (
        <Text
          id="invalid-file-warning"
          data-cy="invalid-file-warning"
          data-testid="invalid-file-warning"
          sx={{
            color: 'error',
          }}
        >
          {error}
        </Text>
      )}
    </Flex>
  );
};

const AlreadyAddedFiles = ({
  files,
  deleteFile,
}: {
  files: MediaFile[];
  deleteFile: (id: string) => void;
}) => {
  return (
    <Flex sx={{ flexDirection: 'column', gap: 2 }}>
      {files.map((file) => (
        <FileDisplay key={file.id} file={file} onRemove={() => deleteFile(file.id)} />
      ))}
    </Flex>
  );
};

interface UploadNewFilesProps {
  contentType: 'projects' | 'research' | 'questions' | 'news';
  contentId: number | null;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  uploadError: string | null;
  setUploadError: (value: string | null) => void;
}

const UploadNewFiles = ({
  contentType,
  contentId,
  isUploading,
  setIsUploading,
  uploadError,
  setUploadError,
}: UploadNewFilesProps) => {
  const { fileLink, files } = fileLabels;
  const identity = 'file-download-link';
  const state = useFormState<IFilesForm>();
  const form = useForm<ProjectFormData>();

  const handleFilesChange = async (selectedFiles: (Blob | File)[]) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const uploadedFiles: MediaFile[] = [];

      for (const file of selectedFiles) {
        if (file instanceof File) {
          const uploadedFile = await storageService.fileUpload(contentId, contentType, file);
          uploadedFiles.push(uploadedFile);
        }
      }

      // Add uploaded files to existing files in form state
      const currentFiles = state.values.files || [];
      form.change('files', [...currentFiles, ...uploadedFiles]);
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('Failed to upload one or more files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {uploadError && <Text sx={{ color: 'error', fontSize: 1, mb: 2 }}>{uploadError}</Text>}
      <Flex sx={{ flexDirection: 'column', mb: 3 }}>
        <AuthWrapper
          roleRequired={UserRole.ADMIN}
          fallback={
            <>
              {isUploading ? (
                <Flex sx={{ alignItems: 'center', mb: 2 }}>
                  <Spinner />
                  <Text sx={{ ml: 2 }}>Uploading files...</Text>
                </Flex>
              ) : (
                <Field
                  hasText={false}
                  name="fileUploadTrigger"
                  data-cy="file-input-field"
                  component={FileInputField}
                  admin={false}
                  onFilesChange={handleFilesChange}
                />
              )}
              <Text sx={{ fontSize: 1, color: 'grey', mt: 1 }}>{files.description}</Text>
            </>
          }
        >
          {isUploading ? (
            <Flex sx={{ alignItems: 'center', mb: 2 }}>
              <Spinner />
              <Text sx={{ ml: 2 }}>Uploading files...</Text>
            </Flex>
          ) : (
            <Field
              hasText={false}
              name="fileUploadTrigger"
              data-cy="file-input-field"
              admin={true}
              component={FileInputField}
              onFilesChange={handleFilesChange}
            />
          )}
          <Text sx={{ fontSize: 1, color: 'grey', mt: 1 }}>Maximum file size 300MB</Text>
        </AuthWrapper>
      </Flex>
      <Flex sx={{ flexDirection: 'column' }}>
        <Label htmlFor={identity} sx={{ fontSize: 1, mb: 2 }}>
          {fileLink.title}
        </Label>
        <Field
          id="fileLink"
          name="fileLink"
          data-cy="fileLink"
          component={FieldInput}
          isEqual={COMPARISONS.textInput}
          maxLength={MAX_LINK_LENGTH}
          placeholder={fileLink.placeholder}
          validateFields={[]}
        />
      </Flex>
    </>
  );
};
