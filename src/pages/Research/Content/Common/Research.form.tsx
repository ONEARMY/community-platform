import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-calculate'
import { observer } from 'mobx-react'
import * as React from 'react'
import { Field, Form } from 'react-final-form'
import type { RouteComponentProps } from 'react-router'
import { Prompt } from 'react-router'
import { Box, Card, Flex, Heading, Label } from 'theme-ui'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import {
  Button,
  FieldInput,
  FieldTextarea,
  ElWithBeforeIcon,
  ResearchEditorOverview,
} from 'oa-components'
import { TagsSelectField } from 'src/common/Form/TagsSelect.field'
import type { IResearch } from 'src/models/research.models'
import { useResearchStore } from 'src/stores/Research/research.store'
import { COMPARISONS } from 'src/utils/comparisons'
import { stripSpecialCharacters } from 'src/utils/helpers'
import { required } from 'src/utils/validators'
import { PostingGuidelines } from './PostingGuidelines'
import { ResearchSubmitStatus } from './SubmitStatus'
import { CategoriesSelect } from 'src/pages/Howto/Category/CategoriesSelect'
import { RESEARCH_TITLE_MAX_LENGTH, RESEARCH_MAX_LENGTH } from '../../constants'

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
  const store = useResearchStore()
  const [state, setState] = React.useState<IState>({
    formSaved: false,
    _toDocsList: false,
    showSubmitModal: false,
  })
  const [submissionHandler, setSubmissionHandler] = React.useState({
    draft: props.formValues.moderation === 'draft',
    shouldSubmit: false,
  })

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

  const validateTitle = async (value: any) => {
    const originalId =
      props.parentType === 'edit' ? props.formValues._id : undefined
    return store.validateTitleForSlug(value, 'research', originalId)
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
        initialValues={props.formValues}
        mutators={{
          ...arrayMutators,
        }}
        validateOnBlur
        decorators={[calculatedFields, unloadDecorator]}
        render={({ submitting, dirty, handleSubmit }) => {
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
                          {props.parentType === 'create' ? (
                            <span>Start your Research</span>
                          ) : (
                            <span>Edit your Research</span>
                          )}{' '}
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
                                Title of your research. Can we...
                              </ResearchFormLabel>
                              <Field
                                id="title"
                                name="title"
                                data-cy="intro-title"
                                validateFields={[]}
                                validate={validateTitle}
                                isEqual={COMPARISONS.textInput}
                                component={FieldInput}
                                maxLength={RESEARCH_TITLE_MAX_LENGTH}
                                showCharacterCount
                                placeholder={`Can we make a chair from.. (max ${RESEARCH_TITLE_MAX_LENGTH} characters)`}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <ResearchFormLabel htmlFor="description">
                                What are you trying to find out?
                              </ResearchFormLabel>
                              <Field
                                id="description"
                                name="description"
                                data-cy="intro-description"
                                validate={required}
                                validateFields={[]}
                                isEqual={COMPARISONS.textInput}
                                component={FieldTextarea}
                                style={{
                                  resize: 'none',
                                  flex: 1,
                                  minHeight: '150px',
                                }}
                                maxLength={RESEARCH_MAX_LENGTH}
                                placeholder={`Introduction to your research question. Mention what you want to do, whats the goal and what challenges you see etc (max ${RESEARCH_MAX_LENGTH} characters)`}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <ResearchFormLabel>
                                What category fits your research?
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
                                    placeholder="Select category"
                                    type="research"
                                  />
                                )}
                              />
                            </Flex>
                            <Flex sx={{ flexDirection: 'column' }} mb={3}>
                              <ResearchFormLabel>
                                Select tags for your research
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
                                Who have you been collaborating on this Research
                                with?
                              </ResearchFormLabel>
                              <Field
                                name="collaborators"
                                component={FieldInput}
                                placeholder="A comma separated list of usernames."
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
                    onClick={() =>
                      setSubmissionHandler({ shouldSubmit: true, draft: true })
                    }
                    mt={[0, 0, 3]}
                    variant="secondary"
                    type="submit"
                    disabled={submitting}
                    sx={{ width: '100%', display: 'block' }}
                  >
                    {props.formValues.moderation !== 'draft' ? (
                      <span>Revert to draft</span>
                    ) : (
                      <span>Save to draft</span>
                    )}{' '}
                  </Button>
                  <Button
                    large
                    data-cy={'submit'}
                    onClick={() =>
                      setSubmissionHandler({ shouldSubmit: true, draft: false })
                    }
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
                    <span>Publish</span>
                  </Button>
                </Box>

                {props.formValues.updates ? (
                  <ResearchEditorOverview
                    sx={{ mt: 4 }}
                    updates={props.formValues?.updates.map((u) => ({
                      isActive: false,
                      status: u.status,
                      title: u.title,
                      slug: u._id,
                    }))}
                    researchSlug={props.formValues.slug}
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
