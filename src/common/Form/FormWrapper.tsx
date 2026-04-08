import { availableGlyphs, Button, Icon, Loader } from 'oa-components';
import type { ContentFormType } from 'oa-shared';
import { Box, Card, Flex, Heading } from 'theme-ui';
import { ErrorsContainer } from './ErrorsContainer';
import type { IErrorsListSet } from './types';

interface IProps {
  buttonLabel: string;
  contentType: ContentFormType;
  children: React.ReactNode;
  errorsClientSide?: IErrorsListSet[];
  errorSubmitting?: string;
  guidelines?: React.ReactNode;
  handleSubmit: () => void;
  handleSubmitDraft: (e: React.MouseEvent) => void;
  heading: string;
  hasValidationErrors: boolean;
  belowBody?: React.ReactNode;
  sidebar?: React.ReactNode;
  submitFailed: boolean;
  submitting: boolean;
  hideSubmittingMessage?: boolean;
  unsavedChangesDialog?: React.ReactNode;
}

const DRAFT_LABEL = 'Save as draft';

const glyphMap: { [key in ContentFormType]: availableGlyphs } = {
  news: 'news',
  projects: 'library',
  questions: 'library',
  research: 'research',
  researchUpdate: 'research',
};

export const FormWrapper = (props: IProps) => {
  const {
    belowBody,
    buttonLabel,
    children,
    contentType,
    errorsClientSide,
    errorSubmitting,
    guidelines,
    handleSubmit,
    handleSubmitDraft,
    heading,
    hasValidationErrors,
    sidebar,
    submitFailed,
    submitting,
    hideSubmittingMessage,
    unsavedChangesDialog,
  } = props;

  const hasClientSideErrors = hasValidationErrors && submitFailed;
  const glyph = glyphMap[contentType];

  return (
    <Flex
      sx={{
        flexWrap: 'wrap',
        backgroundColor: 'inherit',
        marginTop: 4,
        gap: '1rem',
      }}
    >
      <Flex
        sx={{
          backgroundColor: 'inherit',
          width: ['100%', '100%', `${(2 / 3) * 100}%`],
        }}
      >
        {unsavedChangesDialog}
        <Flex
          as="form"
          id={`${contentType}Form`}
          sx={{ width: '100%', flexDirection: 'column', gap: '1rem' }}
          onSubmit={handleSubmit}
        >
          <Card sx={{ backgroundColor: 'softblue' }}>
            <Flex
              data-cy={`${contentType}-title`}
              sx={{ alignItems: 'center', paddingX: 3, paddingY: 2, gap: 3 }}
            >
              <Heading as="h1">{heading}</Heading>
              <Icon glyph={glyph} size={20} />
            </Flex>
          </Card>
          {guidelines && <Box sx={{ display: ['block', 'block', 'none'] }}>{guidelines}</Box>}
          <Card
            sx={{
              padding: 4,
              overflow: 'visible',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {children}
          </Card>
          {belowBody}
        </Flex>
      </Flex>
      <Flex
        sx={{
          flexDirection: 'column',
          backgroundColor: 'inherit',
          maxWidth: ['inherit', 'inherit', '400px'],
          width: ['100%', '100%', '30%'],
          alignItems: 'space-between',
          gap: 3,
        }}
      >
        {guidelines && <Box sx={{ display: ['none', 'none', 'block'] }}>{guidelines}</Box>}
        <Button
          large
          data-cy="submit"
          variant="primary"
          type="submit"
          disabled={submitting}
          onClick={handleSubmit}
          sx={{
            width: '100%',
            display: 'block',
          }}
        >
          {buttonLabel}
        </Button>

        <Button
          data-cy="draft"
          onClick={handleSubmitDraft}
          variant="secondary"
          type="submit"
          disabled={submitting}
          sx={{
            width: '100%',
            display: 'block',
          }}
        >
          {DRAFT_LABEL}
        </Button>

        {submitting && !hideSubmittingMessage && (
          <Loader label="Submitting, please do not close the page..." />
        )}
        {sidebar && sidebar}
        {errorSubmitting && <ErrorsContainer serverErrors={[errorSubmitting]} />}
        {hasClientSideErrors && <ErrorsContainer clientErrors={errorsClientSide} />}
      </Flex>
    </Flex>
  );
};
