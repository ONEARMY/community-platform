import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-calculate'
import { observer } from 'mobx-react'
import * as React from 'react'
import { Field, Form } from 'react-final-form'
import { Prompt, RouteComponentProps } from 'react-router'
import { Box } from 'theme-ui'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { Button } from 'oa-components'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'
import Flex from 'src/components/Flex'
import { InputField, TextAreaField } from 'src/components/Form/Fields'
import { TagsSelectField } from 'src/components/Form/TagsSelect.field'
import Heading from 'src/components/Heading'
import { IResearch } from 'src/models/research.models'
import { useResearchStore } from 'src/stores/Research/research.store'
import theme from 'src/themes/styled.theme'
import { COMPARISONS } from 'src/utils/comparisons'
import { stripSpecialCharacters } from 'src/utils/helpers'
import { required } from 'src/utils/validators'
import styled from '@emotion/styled'
import { PostingGuidelines } from './PostingGuidelines'
import { ResearchSubmitStatus } from './SubmitStatus'

const CONFIRM_DIALOG_MSG =
  'You have unsaved changes. Are you sure you want to leave this page?'

interface IState {
  formSaved: boolean
  _toDocsList: boolean
  showSubmitModal?: boolean
}
interface IProps extends RouteComponentProps<any> {
  formValues: any
  parentType: 'create' | 'edit'
}

const FormContainer = styled.form`
  width: 100%;
`

const Label = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  margin-bottom: ${theme.space[2] + 'px'};
  display: block;
`

const beforeUnload = function(e) {
  e.preventDefault()
  e.returnValue = CONFIRM_DIALOG_MSG
}

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
        setState(prevState => ({ ...prevState, showSubmitModal: true }))
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

  // automatically generate the slug when the title changes
  const calculatedFields = createDecorator({
    field: 'title',
    updates: {
      slug: title => stripSpecialCharacters(title).toLowerCase(),
    },
  })

  // Display a confirmation dialog when leaving the page outside the React Router
  const unloadDecorator = form => {
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
    <>
      {state.showSubmitModal && (
        <ResearchSubmitStatus
          {...props}
          onClose={() => {
            setState(prevState => ({ ...prevState, showSubmitModal: false }))
            store.resetResearchUploadStatus()
          }}
        />
      )}
      <Form
        onSubmit={v => {
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
              <Flex bg="inherit" px={2} sx={{ width: ['100%', '100%', `${2 / 3 * 100}%`] }} mt={4}>
                <Prompt
                  when={!store.researchUploadStatus.Complete && dirty}
                  message={CONFIRM_DIALOG_MSG}
                />
                <FormContainer id="researchForm" onSubmit={handleSubmit}>
                  {/* Research Info */}
                  <Flex sx={{ flexDirection: 'column' }}>
                    <Flex
                      card
                      mediumRadius
                      bg={theme.colors.softblue}
                      px={3}
                      py={2}
                      sx={{ alignItems: 'center' }}
                    >
                      <Heading medium>
                        {props.parentType === 'create' ? (
                          <span>Start your Research</span>
                        ) : (
                          <span>Edit your Research</span>
                        )}{' '}
                      </Heading>
                      <Box ml="15px">
                        <ElWithBeforeIcon
                          IconUrl={IconHeaderHowto}
                          height="20px"
                        />
                      </Box>
                    </Flex>
                    <Box
                      sx={{ mt: '20px', display: ['block', 'block', 'none'] }}
                    >
                      <PostingGuidelines />
                    </Box>
                    <Flex
                      card
                      mediumRadius
                      bg={'white'}
                      mt={3}
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
                            <Label htmlFor="title">
                              Title of your research. Can we...
                            </Label>
                            <Field
                              id="title"
                              name="title"
                              data-cy="intro-title"
                              validateFields={[]}
                              validate={validateTitle}
                              isEqual={COMPARISONS.textInput}
                              component={InputField}
                              maxLength="60"
                              placeholder="Can we make a chair from.. (max 60 characters)"
                            />
                          </Flex>
                          <Flex sx={{ flexDirection: 'column' }} mb={3}>
                            <Label htmlFor="description">
                              What are you trying to find out?
                            </Label>
                            <Field
                              id="description"
                              name="description"
                              data-cy="intro-description"
                              validate={required}
                              validateFields={[]}
                              isEqual={COMPARISONS.textInput}
                              component={TextAreaField}
                              style={{
                                resize: 'none',
                                flex: 1,
                                minHeight: '150px',
                              }}
                              maxLength="1000"
                              placeholder="Introduction to your research question. Mention what you want to do, whats the goal and what challenges you see etc (max 1000 characters)"
                            />
                          </Flex>
                          <Flex sx={{ flexDirection: 'column' }} mb={3}>
                            <Label>Select tags for your Research</Label>
                            <Field
                              name="tags"
                              component={TagsSelectField}
                              category="research"
                              isEqual={COMPARISONS.tags}
                            />
                          </Flex>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </FormContainer>
              </Flex>
              {/* post guidelines container */}
              <Flex
                sx={{
                  flexDirection: 'column',
                  width: [1, 1, 1 / 3],
                  height: '100%',
                }}
                bg="inherit"
                px={2}
                mt={[0, 0, 4]}
              >
                <Box
                  sx={{
                    position: ['relative', 'relative', 'fixed'],
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
                    data-cy={'submit'}
                    onClick={() =>
                      setSubmissionHandler({ shouldSubmit: true, draft: false })
                    }
                    mt={3}
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    sx={{ width: '100%', mb: ['40px', '40px', 0] }}
                  >
                    <span>Publish</span>
                  </Button>
                </Box>
              </Flex>
            </Flex>
          )
        }}
      />
    </>
  )
})

export default ResearchForm
