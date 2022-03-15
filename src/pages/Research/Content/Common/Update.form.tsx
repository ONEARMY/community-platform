import arrayMutators from 'final-form-arrays'
import { observer } from 'mobx-react'
import * as React from 'react'
import { Field, Form } from 'react-final-form'
import { Prompt, RouteComponentProps } from 'react-router'
import { Box } from 'rebass'
import IconHeaderHowto from 'src/assets/images/header-section/howto-header-icon.svg'
import { Button } from 'oa-components'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'
import Flex from 'src/components/Flex'
import { InputField, TextAreaField } from 'src/components/Form/Fields'
import { ImageInputField } from 'src/components/Form/ImageInput.field'
import Heading from 'src/components/Heading'
import { IResearch } from 'src/models/research.models'
import { useResearchStore } from 'src/stores/Research/research.store'
import theme from 'src/themes/styled.theme'
import { COMPARISONS } from 'src/utils/comparisons'
import { required } from 'src/utils/validators'
import styled from '@emotion/styled'
import { UpdateSubmitStatus } from './SubmitStatus'

const ImageInputFieldWrapper = styled.div`
  width: 150px;
  height: 100px;
  margin-right: 10px;
  margin-bottom: 6px;
`

const CONFIRM_DIALOG_MSG =
  'You have unsaved changes. Are you sure you want to leave this page?'

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

const UpdateForm = observer((props: IProps) => {
  const store = useResearchStore()
  const [showSubmitModal, setShowSubmitModal] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (store.updateUploadStatus?.Complete) {
      window.removeEventListener('beforeunload', beforeUnload, false)
    }
  }, [store.updateUploadStatus?.Complete])

  const trySubmitForm = () => {
    const form = document.getElementById('updateForm')
    if (typeof form !== 'undefined' && form !== null) {
      form.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      )
    }
  }

  const onSubmit = (formValues: IResearch.Update) => {
    setShowSubmitModal(true)
    store.uploadUpdate(formValues)
  }

  // Display a confirmation dialog when leaving the page outside the React Router
  const unloadDecorator = form => {
    return form.subscribe(
      ({ dirty }) => {
        if (dirty && !store.updateUploadStatus.Complete) {
          window.addEventListener('beforeunload', beforeUnload, false)
          return
        }
        window.removeEventListener('beforeunload', beforeUnload, false)
      },
      { dirty: true },
    )
  }

  /**
   * Ensure either url or images included (not both), and any url formatted correctly
   */
  const validateMedia = (videoUrl: string, values: any) => {
    const images = values.images
    if (videoUrl) {
      if (images && images[0]) {
        return 'Do not include both images and video'
      }
      const ytRegex = new RegExp(/(youtu\.be\/|youtube\.com\/watch\?v=)/gi)
      const urlValid = ytRegex.test(videoUrl)
      return urlValid ? null : 'Please provide a valid YouTube Url'
    }
    return images && images[0] ? null : 'Include either images or a video'
  }

  return (
    <>
      {showSubmitModal && (
        <UpdateSubmitStatus
          {...props}
          onClose={() => {
            setShowSubmitModal(false)
            store.resetUpdateUploadStatus()
          }}
        />
      )}
      <Form
        onSubmit={v => {
          onSubmit(v as IResearch.Update)
        }}
        initialValues={props.formValues}
        mutators={{
          ...arrayMutators,
        }}
        validateOnBlur
        decorators={[unloadDecorator]}
        render={({ submitting, dirty, handleSubmit }) => {
          return (
            <Flex mx={-2} mb={4} bg={'inherit'} flexWrap="wrap">
              <Flex bg="inherit" px={2} width={[1, 1, 2 / 3]} mt={4}>
                <Prompt
                  when={!store.updateUploadStatus.Complete && dirty}
                  message={CONFIRM_DIALOG_MSG}
                />
                <FormContainer id="updateForm" onSubmit={handleSubmit}>
                  {/* Update Info */}
                  <Flex flexDirection={'column'}>
                    <Flex
                      card
                      mediumRadius
                      bg={theme.colors.softblue}
                      px={3}
                      py={2}
                      alignItems="center"
                    >
                      <Heading medium>
                        {props.parentType === 'create' ? (
                          <span>New update</span>
                        ) : (
                          <span>Edit your update</span>
                        )}{' '}
                        
                      </Heading>
                      <Box ml="15px">
                        <ElWithBeforeIcon
                          IconUrl={IconHeaderHowto}
                          height="20px"
                        />
                      </Box>
                    </Flex>
                    <Flex
                      card
                      mediumRadius
                      bg={'white'}
                      mt={3}
                      p={4}
                      flexWrap="wrap"
                      flexDirection="column"
                    >
                      <Flex mx={-2} flexDirection={['column', 'column', 'row']}>
                        <Flex flex={[1, 1, 4]} px={2} flexDirection="column">
                          <Flex flexDirection={'column'} mb={3}>
                            <Label htmlFor="title">Title of this update</Label>
                            <Field
                              id="title"
                              name="title"
                              data-cy="intro-title"
                              validateFields={[]}
                              validate={required}
                              isEqual={COMPARISONS.textInput}
                              component={InputField}
                              maxLength="40"
                              placeholder="Title of this update (max 40 characters)"
                            />
                          </Flex>
                          <Flex flexDirection={'column'} mb={3}>
                            <Label htmlFor="description">
                              Description of this update
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
                              maxLength="1500"
                              placeholder="Explain what is happening in your research (max 1500 characters)"
                            />
                          </Flex>
                          <Label htmlFor={`images`}>
                            Upload image(s) for this update
                          </Label>
                          <Flex
                            flexDirection={['column', 'row']}
                            flexWrap="wrap"
                            alignItems="center"
                            mb={3}
                          >
                            <ImageInputFieldWrapper data-cy="image-0">
                              <Field
                                hasText={false}
                                name={`images[0]`}
                                component={ImageInputField}
                                isEqual={COMPARISONS.image}
                                validateFields={['videoUrl']}
                              />
                            </ImageInputFieldWrapper>
                            <ImageInputFieldWrapper data-cy="image-1">
                              <Field
                                hasText={false}
                                name={`images[1]`}
                                validateFields={['videoUrl']}
                                component={ImageInputField}
                                isEqual={COMPARISONS.image}
                              />
                            </ImageInputFieldWrapper>
                            <ImageInputFieldWrapper data-cy="image-2">
                              <Field
                                hasText={false}
                                name={`images[2]`}
                                validateFields={['videoUrl']}
                                component={ImageInputField}
                                isEqual={COMPARISONS.image}
                              />
                            </ImageInputFieldWrapper>
                            <ImageInputFieldWrapper data-cy="image-3">
                              <Field
                                hasText={false}
                                name={`images[3]`}
                                validateFields={['videoUrl']}
                                component={ImageInputField}
                                isEqual={COMPARISONS.image}
                              />
                            </ImageInputFieldWrapper>
                            <ImageInputFieldWrapper data-cy="image-4">
                              <Field
                                hasText={false}
                                name={`images[4]`}
                                validateFields={['videoUrl']}
                                component={ImageInputField}
                                isEqual={COMPARISONS.image}
                              />
                            </ImageInputFieldWrapper>
                          </Flex>
                          <Flex flexDirection="column" mb={3}>
                            <Label htmlFor={`videoUrl`}>
                              Or embed a YouTube video
                            </Label>
                            <Field
                              name={`videoUrl`}
                              data-cy="videoUrl"
                              component={InputField}
                              placeholder="https://youtube.com/watch?v="
                              validate={(url, values) =>
                                validateMedia(url, values)
                              }
                              validateFields={[]}
                              isEqual={COMPARISONS.textInput}
                            />
                          </Flex>
                        </Flex>
                      </Flex>
                    </Flex>
                  </Flex>
                </FormContainer>
              </Flex>
              <Flex
                flexDirection={'column'}
                width={[1, 1, 1 / 3]}
                height={'100%'}
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
                  <Button
                    data-cy={'submit'}
                    onClick={trySubmitForm}
                    width={1}
                    mt={3}
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    sx={{ mb: ['40px', '40px', 0] }}
                  >
                    <span>
                      {props.parentType === 'edit' ? 'Save' : 'Add update'}
                    </span>
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

export default UpdateForm
