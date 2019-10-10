import React, { Component } from 'react'
import { Field } from 'react-final-form'
import { TextAreaField, InputField } from 'src/components/Form/Fields'
import { Box, Image } from 'rebass'
import Heading from 'src/components/Heading'
import { ImageInputField } from 'src/components/Form/ImageInput.field'
import Flex from 'src/components/Flex'
import { Button } from 'src/components/Button'
import { Modal } from 'src/components/Modal/Modal'
import Text from 'src/components/Text'
import styled from 'styled-components'
import theme from 'src/themes/styled.theme'
import { IHowtoStep } from 'src/models/howto.models'
import { IUploadedFileMeta } from 'src/stores/storage'
import arrayMutators from 'final-form-arrays'
import { FieldArray } from 'react-final-form-arrays'
import { ImageInput } from 'src/components/ImageInput/ImageInput'

// interface IProps2 {
//   name?: string
//   value: any
//   onChange: (files: Array<any>) => void
//   disabled?: boolean
//   children?: React.ReactNode
//   index?: number
// }

// interface IState2 {
//   inputValues: Array<any>
// }

// class ImageInputFieldWrapper extends Component<IProps2, IState2> {
//   constructor(props) {
//     super(props)

//     this.state = {
//       inputValues: [],
//     }
//   }

//   componentDidMount() {
//     // console.log('ImageInputFieldWrapper.props', this.props)
//     if (this.props.value.length > 0) {
//       this.setState({
//         inputValues: this.props.value,
//       })
//     }
//   }

//   componentDidUpdate(prevProps, prevState) {}

//   public updateObjectInArray = (array, action) => {
//     return array.map((item, index) => {
//       if (index !== action.index) {
//         // This isn't the item we care about - keep it as-is
//         return item
//       }

//       // Otherwise, this is the one we want - return an updated value
//       return {
//         ...item,
//         ...action.item,
//       }
//     })
//   }

//   public updateFile = file => {
//     const filesToUpdate = this.state.inputValues
//     const updatedFilesArray = this.updateObjectInArray(this.state.inputValues, {
//       index: filesToUpdate.indexOf(file),
//       file,
//     })
//     this.setState(
//       {
//         inputValues: updatedFilesArray,
//       },
//       () => this.props.onChange(updatedFilesArray),
//     )
//   }

//   public removeFile = file => {
//     const newFiles = this.state.inputValues
//     newFiles.splice(newFiles.indexOf(file), 1)
//     // console.log('newFiles', newFiles)
//     this.setState(
//       {
//         inputValues: newFiles,
//       },
//       () => this.props.onChange(this.state.inputValues),
//     )
//   }

//   public handleInputChange = (value: any, index: number) => {
//     this.setState(prevState => {
//       const updatedArray = prevState.inputValues
//       updatedArray[index] = value

//       return {
//         ...prevState,
//         inputValues: updatedArray,
//       }
//     })

//     this.props.onChange(this.state.inputValues)
//   }

//   render() {
//     console.log('inoutVals', this.state.inputValues)

//     let firstImage = null
//     if (this.state.inputValues.length >= 1) {
//       firstImage = this.state.inputValues[0]
//     }

//     console.log('first', firstImage)

//     return (
//       <Flex>
//         {/* //   <pre>
//       //     <code>{JSON.stringify(this.state.inputValues, null, 2)}</code>
//       //   </pre> */}
//         <ImageFieldContainer>
//           <ImageInput
//             canDelete
//             onFilesChange={file => this.handleInputChange(file, 0)}
//             onDelete={file => this.removeFile(file)}
//             value={firstImage}
//             hasText={false}
//           />
//         </ImageFieldContainer>
//         <ImageFieldContainer>
//           <ImageInput
//             canDelete
//             onFilesChange={file => this.handleInputChange(file, 1)}
//             onDelete={file => this.removeFile(file)}
//             value={null}
//             hasText={false}
//           />
//         </ImageFieldContainer>
//         <ImageFieldContainer>
//           <ImageInput
//             canDelete
//             onFilesChange={file => this.handleInputChange(file, 2)}
//             onDelete={file => this.removeFile(file)}
//             value={null}
//             hasText={false}
//           />
//         </ImageFieldContainer>
//       </Flex>
//     )
//   }
// }

interface IProps {
  step: any | IHowtoStep
  index: number
  images: IUploadedFileMeta[]
  onDelete: (index: number) => void
}
interface IState {
  showDeleteModal: boolean
  _toDocsList: boolean
  editStepImgIndex?: number
}

const required = (value: any) => (value ? undefined : 'Required')

const Label = styled.label`
  font-size: ${theme.fontSizes[2] + 'px'};
  margin-bottom: ${theme.space[2] + 'px'};
`

const ImageFieldContainer = props => (
  <Box height="100px" width="150px" mr={10}>
    {props.children}
  </Box>
)

class HowtoStep extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showDeleteModal: false,
      _toDocsList: false,
    }
  }

  toggleDeleteModal() {
    this.setState({ showDeleteModal: !this.state.showDeleteModal })
  }
  confirmDelete() {
    this.toggleDeleteModal()
    this.props.onDelete(this.props.index)
  }

  render() {
    const { step, index, images } = this.props
    const { editStepImgIndex } = this.state
    // console.log('step', step)
    // console.log('images', images)

    return (
      // NOTE - animation parent container in CreateHowTo
      <Flex
        mt={5}
        p={3}
        key={index}
        card
        mediumRadius
        bg={'white'}
        flexDirection={'column'}
      >
        <Flex p={0}>
          <Heading small flex={1} mb={3}>
            Step {index + 1}
          </Heading>
          {index >= 1 && (
            <Button
              small
              variant={'tertiary'}
              icon="delete"
              onClick={() => this.toggleDeleteModal()}
            />
          )}
          {this.state.showDeleteModal && (
            <Modal onDidDismiss={() => this.toggleDeleteModal()}>
              <Text>Are you sure you want to delete this step?</Text>
              <Flex mt={3} p={0} mx={-1} justifyContent="flex-end">
                <Flex px={1}>
                  <Button
                    small
                    variant={'outline'}
                    onClick={() => this.toggleDeleteModal()}
                  >
                    Cancel
                  </Button>
                </Flex>
                <Flex px={1}>
                  <Button
                    small
                    variant={'tertiary'}
                    onClick={() => this.confirmDelete()}
                  >
                    Delete
                  </Button>
                </Flex>
              </Flex>
            </Modal>
          )}
        </Flex>

        <Flex flexDirection="column" mb={3}>
          <Label htmlFor={`${step}.title`}>Title of this step *</Label>
          <Field
            name={`${step}.title`}
            component={InputField}
            placeholder="Title of this step"
            validate={required}
            validateFields={[]}
          />
        </Flex>
        <Flex flexDirection="column" mb={3}>
          <Label htmlFor={`${step}.text`}>Description of this step *</Label>
          <Field
            name={`${step}.text`}
            placeholder="Description of this step"
            component={TextAreaField}
            style={{ resize: 'vertical', height: '300px' }}
            validate={required}
            validateFields={[]}
          />
        </Flex>
        <Label htmlFor={`${step}.text`}>Upload image(s) for this step *</Label>

        <Flex flexWrap="nowrap">
          {/* <Field name={`${step}.images`}>
            {props => (
              <div>
                <ImageStepUpload
                  name={props.input.name}
                  value={props.input.value}
                  onChange={props.input.onChange}
                />
              </div>
            )}
          </Field> */}

          <ImageFieldContainer>
            <Field
              canDelete
              hasText={false}
              variant="small"
              name={`${step}.img1`}
              component={ImageInputField}
            />
          </ImageFieldContainer>

          {/* <Field name={`${step}.images`}>
            {props => (
              <div>
                <ImageInputFieldWrapper
                  value={props.input.value}
                  onChange={files => {
                    console.log('PROPS', props)
                    // console.log('TELL THE FORM', files)
                    return props.input.onChange(files)
                  }}
                />
              </div>
            )}
          </Field> */}

          {/* <ImageFieldContainer>
          <ImageInput
            value={null}
            onFilesChange={(files) => console.log('INPUT', files)}
          />
          </ImageFieldContainer> */}

          {/* {[...Array(3)].map((image, i) => (
                <ImageFieldContainer key={i}>
                <Field
                  canDelete
                  hasText={false}
                  variant="small"
                  name={`${step}.images`}
                  component={ImageInputField}
                  validateFields={[]}
                />
              </ImageFieldContainer>
          ))} */}
        </Flex>
      </Flex>

      /* // </Flex>
        // <Flex mt={2}>
        //   <Field
        //     name={`${step}.caption`}
        //     component={InputField}
        //     placeholder="Insert Caption"
        //   />
        // </Flex>
      // </Flex> */
    )
  }
}

export { HowtoStep }
