import React, { Component } from 'react'
import CardContent from '@material-ui/core/CardContent'
import Dialog from '@material-ui/core/Dialog'
import { FieldArray } from 'react-final-form-arrays'
import { Field } from 'react-final-form'
import Button from 'src/components/Button/Button'
import { TextArea, InputField } from 'src/components/Form/Fields'

import {
  StepHeader,
  StepTitle,
  Label,
  Container,
  StepCard,
  DeleteStepBtn,
  DeleteText,
  DeleteIcon,
  StepImage,
  DialogText,
  DialogButtons,
} from './elements.js'

import { FirebaseFileUploader } from 'src/pages/common/FirebaseFileUploader/FirebaseFileUploader'

const required = value => (value ? undefined : 'Required')

const Header = ({ index }) => {
  return (
    <StepHeader>
      <StepTitle variant="h5" component="h2">
        Step {index + 1}
      </StepTitle>
    </StepHeader>
  )
}

class Step extends Component {
  constructor(props) {
    super(props)
    this.state = {
      _isModaleStepDeleteOpen: false,
      _toDocsList: false,
      _uploadFilesPath: 'uploads/test',
      _uploadImgPath: 'uploads/test',
    }
  }

  handleModaleDeleteStepOpen() {
    this.setState({ _isModaleStepDeleteOpen: true })
  }

  handleModaleDeleteStepClose() {
    this.setState({ _isModaleStepDeleteOpen: false })
  }

  render() {
    const { step, index, onDelete, values } = this.props
    return (
      <Container key={index}>
        <StepCard key={step}>
          <Header {...this.props} />
          <CardContent>
            <div>
              <Field
                name={`${step}.title`}
                component={InputField}
                label="Pick a title for this step"
                placeholder="Step title"
                validate={required}
              />
              <Field
                name={`${step}.text`}
                label="Describe this step"
                component={TextArea}
                placeholder="Description"
                validate={required}
              />
            </div>
            <FieldArray name={`${step}.images`}>
              {({ fields }) => (
                <React.Fragment>
                  {fields.map((image, imgIndex) => {
                    return (
                      values.steps[index].images &&
                      values.steps[index].images[imgIndex] && (
                        <StepImage
                          key={image}
                          src={values.steps[index].images[imgIndex]}
                        />
                      )
                    )
                  })}
                  <FirebaseFileUploader
                    hidden={true}
                    buttonText="Upload picture"
                    storagePath={this.state._uploadImgPath}
                    onUploadSuccess={fileInfo => {
                      fields.push(fileInfo.downloadUrl)
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
            {'Are you sure to delete this step ?'}
          </DialogText>
          <DialogButtons>
            <Button
              text={'cancel'}
              modalcancel
              onClick={() => {
                this.handleModaleDeleteStepClose()
              }}
            />
            <Button
              modalvalidation
              text={'yes'}
              onClick={() => {
                onDelete(index)
                this.handleModaleDeleteStepClose()
              }}
            />
          </DialogButtons>
        </Dialog>
      </Container>
    )
  }
}

export { Step }
