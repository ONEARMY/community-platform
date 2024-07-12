import * as React from 'react'
import { Field, Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { observer } from 'mobx-react'
import {
  Button,
  ElWithBeforeIcon,
  FieldInput,
  FieldTextarea,
  ResearchEditorOverview,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { SelectField } from 'src/common/Form/Select.field'
import { TagsSelectField } from 'src/common/Form/TagsSelect.field'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { researchStatusOptions } from 'src/models/research.models'
import {
  ResearchErrors,
  ResearchPostingGuidelines,
  ResearchSubmitStatus,
} from 'src/pages/Research/Content/Common'
import { useResearchStore } from 'src/stores/Research/research.store'
import { COMPARISONS } from 'src/utils/comparisons'
import {
  composeValidators,
  draftValidationWrapper,
  minValue,
  required,
  setAllowDraftSaveFalse,
  setAllowDraftSaveTrue,
  validateTitle,
} from 'src/utils/validators'
import { Box, Card, Flex, Heading, Label } from 'theme-ui'

import { UserNameSelect } from '../../../common/UserNameSelect/UserNameSelect'
import {
  RESEARCH_MAX_LENGTH,
  RESEARCH_TITLE_MAX_LENGTH,
  RESEARCH_TITLE_MIN_LENGTH,
} from '../../constants'
import { buttons, headings, overview } from '../../labels'
import ResearchFieldCategory from './ResearchCategorySelect'

import type { MainFormAction } from 'src/common/Form/types'
import type { IResearch } from 'src/models/research.models'

const CONFIRM_DIALOG_MSG =
  'You have unsaved changes. Are you sure you want to leave this page?'
interface IState {
  formSaved: boolean
  dirty: boolean
  showSubmitModal?: boolean
}
interface IProps {
  'data-testid'?: string
  formValues: any
  parentType: MainFormAction
}

const ResearchFormLabel = ({ children, ...props }) => (
  <Label sx={{ fontSize: 2, mb: 2, display: 'block' }} {...props}>
    {children}
  </Label>
)

const beforeUnload = (e) => {
  e.preventDefault()
  e.returnValue = CONFIRM_DIALOG_MSG
}

const ResearchForm = observer((props: IProps) => {
  const { formValues, parentType } = props
  const { create, update } = buttons.draft

  formValues.researchStatus = formValues.researchStatus || 'In progress'

  const {
    categories,
    collaborators,
    description,
    tags,
    title,
    researchStatus,
  } = overview

  const store = useResearchStore()
  const [state, setState] = React.useState<IState>({
    formSaved: false,
    dirty: false,
    showSubmitModal: false,
  })
  const [submissionHandler, setSubmissionHandler] = React.useState({
    draft: formValues.moderation === IModerationStatus.DRAFT,
    shouldSubmit: false,
  })

  // Managing locked state
  React.useEffect(() => {
    if (store.activeUser) store.lockResearchItem(store.activeUser.userName)

    return () => {
      store.unlockResearchItem()
    }
  }, [store.activeUser])

  React.useEffect(() => {
    if (store.researchUploadStatus.Complete) {
      window.removeEventListener('beforeunload', beforeUnload, false)
    }
  }, [store.researchUploadStatus.Complete])

  React.useEffect(() => {
    if (submissionHandler.shouldSubmit) {
      const form = document.getElementById('researchForm')
      if (typeof form !== 'undefined' && form !== null) {
        form.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        )
        setState((prevState) => ({ ...prevState, showSubmitModal: true }))
      }
    }
  }, [submissionHandler])

  const onSubmit = async (formValues: IResearch.FormInput) => {
    formValues.moderation = submissionHandler.draft
      ? IModerationStatus.DRAFT
      : IModerationStatus.ACCEPTED // No moderation for researches for now
    await store.uploadResearch(formValues)
  }

  // Display a confirmation dialog when leaving the page outside the React Router
  const unloadDecorator = (form) => {
    return form.subscribe(
      ({ dirty }) => {
        if (dirty && !store.researchUploadStatus.Complete) {
          window.addEventListener('beforeunload', beforeUnload, false)
          return
        }
        window.removeEventListener('beforeunload', beforeUnload, false)
      },
      { dirty: true },
    )
  }

  const draftButtonText =
    formValues.moderation !== IModerationStatus.DRAFT ? create : update
  const pageTitle = headings.overview[parentType]

  return (
    <div data-testid={props['data-testid']}>
      {state.showSubmitModal && (
        <ResearchSubmitStatus
          {...props}
          onClose={() => {
            setState((prevState) => ({ ...prevState, showSubmitModal: false }))
            store.resetResearchUploadStatus()
          }}
        />
      )}

      <Form
        onSubmit={(v) => {
          onSubmit(v as IResearch.FormInput)
        }}
        initialValues={formValues}
        mutators={{
          setAllowDraftSaveFalse,
          setAllowDraftSaveTrue,
          ...arrayMutators,
        }}
        validateOnBlur
        decorators={[unloadDecorator]}
        render={({
          dirty,
          errors,
          form,
          handleSubmit,
          hasValidationErrors,
          submitting,
          submitFailed,
        }) => {
          if (state.dirty !== dirty) {
            setState((prev) => ({ ...prev, dirty }))
          }

          return (
            <Flex mx={-2} bg={'inherit'} sx={{ flexWrap: 'wrap' }}>
              <UnsavedChangesDialog
                uploadComplete={store.updateUploadStatus.Complete}
                message={CONFIRM_DIALOG_MSG}
              />

              <Flex
                bg="inherit"
                px={2}
                sx={{ width: ['100%', '100%', `${(2 / 3) * 100}%`] }}
                mt={4}
              >
                <Box
                  as="form"
                  id="researchForm"
                  sx={{ width: '100%' }}
                  onSubmit={handleSubmit}
                >
                  {/* Research Info */}
                  <Flex sx={{ flexDirection: 'column' }}>
                    <Card sx={{ backgroundColor: 'softblue' }}>
                      <Flex px={3} py={2} sx={{ alignItems: 'center' }}>
                        <Heading as="h1">
                          <span>{pageTitle}</span>{' '}
                        </Heading>
                        <Box ml="15px">
                          <ElWithBeforeIcon icon={IconHeaderHowto} size={20} />
                        </Box>
                      </Flex>
                    </Card>
                    <Box
                      sx={{ mt: '20px', display: ['block', 'block', 'none'] }}
                    >
                      <ResearchPostingGuidelines />
                    </Box>
                    <Card mt={3} sx={{ overflow: 'visible' }}>
                      <Flex
                        p={4}
                        sx={{ flexWrap: 'wrap', flexDirection: 'column' }}
                      >
                        <Flex
                          mx={-2}
                          sx={{ flexDirection: ['column', 'column', 'row'] }}
                        >
                          <Flex
                            px={2}
                            sx={{ flexDirection: 'column', flex: [1, 1, 4] }}
                          >
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <ResearchFormLabel htmlFor="title">
                                {title.title}
                                {' *'}
                              </ResearchFormLabel>
                              <Field
                                id="title"
                                name="title"
                                data-cy="intro-title"
                                validateFields={[]}
                                validate={composeValidators(
                                  required,
                                  minValue(RESEARCH_TITLE_MIN_LENGTH),
                                  validateTitle(
                                    parentType,
                                    formValues._id,
                                    store,
                                  ),
                                )}
                                isEqual={COMPARISONS.textInput}
                                component={FieldInput}
                                maxLength={RESEARCH_TITLE_MAX_LENGTH}
                                minLength={RESEARCH_TITLE_MIN_LENGTH}
                                showCharacterCount
                                placeholder={title.placeholder}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <ResearchFormLabel htmlFor="description">
                                {description.title}
                                {' *'}
                              </ResearchFormLabel>
                              <Field
                                id="description"
                                name="description"
                                data-cy="intro-description"
                                validate={(value, allValues) =>
                                  draftValidationWrapper(
                                    value,
                                    allValues,
                                    required,
                                  )
                                }
                                validateFields={[]}
                                isEqual={COMPARISONS.textInput}
                                component={FieldTextarea}
                                style={{
                                  resize: 'none',
                                  flex: 1,
                                  minHeight: '150px',
                                }}
                                maxLength={RESEARCH_MAX_LENGTH}
                                showCharacterCount
                                placeholder={description.placeholder}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <ResearchFormLabel>
                                {categories.title}
                              </ResearchFormLabel>
                              <ResearchFieldCategory />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <ResearchFormLabel>
                                {tags.title}
                              </ResearchFormLabel>
                              <Field
                                name="tags"
                                component={TagsSelectField}
                                isEqual={COMPARISONS.tags}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <ResearchFormLabel>
                                {collaborators.title}
                              </ResearchFormLabel>
                              <Field
                                name="collaborators"
                                component={UserNameSelect}
                                placeholder={collaborators.placeholder}
                                defaultOptions={[]}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <ResearchFormLabel>
                                {researchStatus.title}
                                {' *'}
                              </ResearchFormLabel>
                              <Field
                                name="researchStatus"
                                data-cy="research-status"
                                component={SelectField}
                                placeholder={researchStatus.placeholder}
                                options={researchStatusOptions}
                                validate={composeValidators(required)}
                              />
                            </Flex>
                          </Flex>
                        </Flex>
                      </Flex>
                    </Card>
                  </Flex>
                </Box>
              </Flex>
              {/* post guidelines container */}
              <Flex
                sx={{
                  flexDirection: 'column',
                  width: ['100%', '100%', `${100 / 3}%`],
                  height: '100%',
                }}
                bg="inherit"
                px={2}
                mt={[0, 0, 4]}
              >
                <Box
                  sx={{
                    top: 3,
                    maxWidth: ['inherit', 'inherit', '400px'],
                  }}
                >
                  <Box sx={{ display: ['none', 'none', 'block'] }}>
                    <ResearchPostingGuidelines />
                  </Box>

                  <Button
                    data-cy="draft"
                    onClick={() => {
                      form.mutators.setAllowDraftSaveTrue()
                      setSubmissionHandler({ shouldSubmit: true, draft: true })
                    }}
                    mt={[0, 0, 3]}
                    variant="secondary"
                    type="submit"
                    disabled={submitting}
                    sx={{ width: '100%', display: 'block' }}
                  >
                    <span>{draftButtonText}</span>
                  </Button>

                  <Button
                    large
                    data-cy="submit"
                    onClick={() => {
                      form.mutators.setAllowDraftSaveFalse()
                      setSubmissionHandler({
                        shouldSubmit: true,
                        draft: false,
                      })
                    }}
                    mt={3}
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    sx={{
                      width: '100%',
                      mb: ['40px', '40px', 0],
                      display: 'block',
                    }}
                  >
                    <span>{buttons.publish}</span>
                  </Button>

                  <ResearchErrors
                    errors={errors}
                    isVisible={submitFailed && hasValidationErrors}
                    labels={overview}
                  />
                </Box>
                {formValues.updates ? (
                  <ResearchEditorOverview
                    sx={{ mt: 4 }}
                    updates={formValues?.updates
                      .filter((u) => !u._deleted)
                      .map((u) => ({
                        isActive: false,
                        status: u.status,
                        title: u.title,
                        slug: u._id,
                      }))}
                    researchSlug={formValues.slug}
                    showCreateUpdateButton={true}
                  />
                ) : null}
              </Flex>
            </Flex>
          )
        }}
      />
    </div>
  )
})

export default ResearchForm
