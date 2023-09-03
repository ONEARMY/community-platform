import * as React from 'react'
import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-calculate'
import { observer } from 'mobx-react'
import { Field, Form } from 'react-final-form'
import { Prompt } from 'react-router'
import { Box, Card, Flex, Heading, Label } from 'theme-ui'
import {
  Button,
  FieldInput,
  FieldTextarea,
  ElWithBeforeIcon,
  ResearchEditorOverview,
} from 'oa-components'

import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { TagsSelectField } from 'src/common/Form/TagsSelect.field'
import { useResearchStore } from 'src/stores/Research/research.store'
import { COMPARISONS } from 'src/utils/comparisons'
import { stripSpecialCharacters } from 'src/utils/helpers'
import {
  composeValidators,
  minValue,
  required,
  setAllowDraftSaveFalse,
  setAllowDraftSaveTrue,
  validateTitle,
  draftValidationWrapper,
} from 'src/utils/validators'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'
import {
  RESEARCH_TITLE_MAX_LENGTH,
  RESEARCH_TITLE_MIN_LENGTH,
  RESEARCH_MAX_LENGTH,
} from '../../constants'
import { buttons, headings, overview } from '../../labels'
import { PostingGuidelines, ResearchErrors, ResearchSubmitStatus } from './'

import type { RouteComponentProps } from 'react-router'
import type { IResearch } from 'src/models/research.models'

const CONFIRM_DIALOG_MSG =
  'You have unsaved changes. Are you sure you want to leave this page?'

interface IState {
  formSaved: boolean
  _toDocsList: boolean
  showSubmitModal?: boolean
}
interface IProps extends RouteComponentProps<any> {
  'data-testid'?: string
  formValues: any
  parentType: 'create' | 'edit'
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

// automatically generate the slug when the title changes
const calculatedFields = createDecorator({
  field: 'title',
  updates: {
    slug: (title) => stripSpecialCharacters(title).toLowerCase(),
  },
})

const ResearchForm = observer((props: IProps) => {
  const { formValues, parentType } = props
  const { create, update } = buttons.draft
  const { categories, collaborators, description, tags, title } = overview

  const store = useResearchStore()
  const [state, setState] = React.useState<IState>({
    formSaved: false,
    _toDocsList: false,
    showSubmitModal: false,
  })
  const [submissionHandler, setSubmissionHandler] = React.useState({
    draft: formValues.moderation === 'draft',
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
    formValues.moderation = submissionHandler.draft ? 'draft' : 'accepted' // No moderation for researches for now
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

  const draftButtonText = formValues.moderation !== 'draft' ? create : update
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
        decorators={[calculatedFields, unloadDecorator]}
        render={({
          dirty,
          errors,
          form,
          handleSubmit,
          hasValidationErrors,
          submitting,
          submitFailed,
        }) => {
          return (
            <Flex mx={-2} bg={'inherit'} sx={{ flexWrap: 'wrap' }}>
              <Flex
                bg="inherit"
                px={2}
                sx={{ width: ['100%', '100%', `${(2 / 3) * 100}%`] }}
                mt={4}
              >
                <Prompt
                  when={!store.researchUploadStatus.Complete && dirty}
                  message={CONFIRM_DIALOG_MSG}
                />
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
                        <Heading>
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
                      <PostingGuidelines />
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
                              <Field
                                name="researchCategory"
                                render={({ input, ...rest }) => (
                                  <CategoriesSelect
                                    {...rest}
                                    isForm={true}
                                    onChange={(category) =>
                                      input.onChange(category)
                                    }
                                    value={input.value}
                                    placeholder={categories.placeholder}
                                    type="research"
                                  />
                                )}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <ResearchFormLabel>
                                {tags.title}
                              </ResearchFormLabel>
                              <Field
                                name="tags"
                                component={TagsSelectField}
                                category="research"
                                isEqual={COMPARISONS.tags}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <ResearchFormLabel>
                                {collaborators.title}
                              </ResearchFormLabel>
                              <Field
                                name="collaborators"
                                component={FieldInput}
                                placeholder={collaborators.placeholder}
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
                    <PostingGuidelines />
                  </Box>

                  <Button
                    data-cy={'draft'}
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
                    data-cy={'submit'}
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
