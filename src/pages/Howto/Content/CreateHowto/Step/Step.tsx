import React, { Component } from 'react'
import CardContent from '@material-ui/core/CardContent'
import Dialog from '@material-ui/core/Dialog'
import { FieldArray } from 'react-final-form-arrays'
import { Field } from 'react-final-form'
import { TextArea, InputField } from 'src/components/Form/Fields'

import {
  StepHeader,
  StepTitle,
  Container,
  StepCard,
  DeleteStepBtn,
  DeleteText,
  DeleteIcon,
  DialogText,
  DialogButtons,
  CancelButton,
  ConfirmButton,
} from './elements'

import { FirebaseFileUploader } from 'src/pages/common/FirebaseFileUploader/FirebaseFileUploader'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'

interface IProps {
  step: string
  index: number
  onDelete: any
  values: any
  _uploadPath: string
}
interface IState {
  _isModaleStepDeleteOpen: boolean
  _toDocsList: boolean
}

const required = (value: any) => (value ? undefined : 'Required')

const Header = (index: number) => {
  return (
    <StepHeader>
      <StepTitle variant="h5" component="h2">
        Step {index + 1}
      </StepTitle>
    </StepHeader>
  )
}

class Step extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      _isModaleStepDeleteOpen: false,
      _toDocsList: false,
    }
  }

  handleModaleDeleteStepOpen() {
    this.setState({ _isModaleStepDeleteOpen: true })
  }

  handleModaleDeleteStepClose() {
    this.setState({ _isModaleStepDeleteOpen: false })
  }

  render() {
    const { step, index, onDelete, values, _uploadPath } = this.props
    return (
      <Container key={index}>
        <StepCard key={step}>
          {Header(index)}
          <CardContent>
            <div>
              <Field
                name={`${step}.title`}
                component={InputField}
                label="Pick a title for this step"
                placeholder="Step title"
                validate={required}
                validateFields={[]}
              />
              <Field
                name={`${step}.text`}
                label="Describe this step"
                component={TextArea}
                placeholder="Description"
                validate={required}
                validateFields={[]}
              />
            </div>
            <FieldArray name={`${step}.images`}>
              {({ fields }) => (
                <React.Fragment>
                  {fields.map((name, imgIndex) => {
                    const images = values.steps[index].images
                    return (
                      images &&
                      images[imgIndex] && (
                        <UploadedFile
                          key={name}
                          file={images[imgIndex]}
                          showDelete
                          imagePreview
                          onFileDeleted={() => {
                            fields.remove(imgIndex)
                          }}
                        />
                      )
                    )
                  })}
                  <FirebaseFileUploader
                    hidden={true}
                    buttonText="Upload picture"
                    storagePath={_uploadPath}
                    onUploadSuccess={fileInfo => {
                      fields.push(fileInfo)
                    }}
                  />
                </React.Fragment>
              )}
            </FieldArray>
          </CardContent>
          {index >= 1 && (
            <DeleteStepBtn
              onClick={() => {
                this.handleModaleDeleteStepOpen()
              }}
            >
              <DeleteIcon />
              <DeleteText>delete this step</DeleteText>
            </DeleteStepBtn>
          )}
        </StepCard>
        <Dialog
          open={this.state._isModaleStepDeleteOpen}
          onClose={() => {
            this.setState({
              _isModaleStepDeleteOpen: false,
            })
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogText id="alert-dialog-title">
            {'Are you sure you want to delete this step ?'}
          </DialogText>
          <DialogButtons>
            <CancelButton
              onClick={() => {
                this.handleModaleDeleteStepClose()
              }}
            >
              cancel
            </CancelButton>
            <ConfirmButton
              icon={'check'}
              onClick={() => {
                onDelete(index)
                this.handleModaleDeleteStepClose()
              }}
            >
              yes
            </ConfirmButton>
          </DialogButtons>
        </Dialog>
      </Container>
    )
  }
}

export { Step }
