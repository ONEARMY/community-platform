import React, { Component } from 'react';
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { FieldArray } from 'react-final-form-arrays'
import { Field } from 'react-final-form'

import { FirebaseFileUploader } from 'src/pages/common/FirebaseFileUploader/FirebaseFileUploader'
import { FirebaseFileUploaderField } from 'src/pages/common/FirebaseFileUploader/FirebaseFileUploaderField.jsx'

const required = (value: any) => (value ? undefined : 'Required')

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
    this.setState({ _isModaleStepDeleteOpen: true });
  }

  handleModaleDeleteStepClose() {
    this.setState({ _isModaleStepDeleteOpen: false });
  }

  render() {
    const { step, index, onDelete, values } = this.props;
    return (
    <div className="step__container" key={index}>
      <Card key={step} className="step__card">
        <div className="step__header">
          <Typography variant="h5" component="h2" className="step-number">
            Step {index + 1}
          </Typography>
        </div>
        <CardContent>
          <div>
            <Typography component="label" className="create-tutorial__label" >
              Pick a title for this step
            </Typography>
            <Field
              name={`${step}.title`}
              component="input"
              placeholder="Step title"
              validate={required}
              className="create-tutorial__input"
            />
            <Typography component="label" className="create-tutorial__label" >
              Describe this step
            </Typography>
            <Field
              name={`${step}.text`}
              component="textarea"
              placeholder="Description"
              validate={required}
              className="create-tutorial__input create-tutorial__input--margin"
            />
          </div>
          <FieldArray name={`${step}.images`}>
            {({fields}) => (
              <React.Fragment>
                {fields.map((image, imgIndex) => {
                  return values.steps[index].images && values.steps[index].images[imgIndex] && (
                    <img
                      key={image}
                      className="step-img"
                      src={values.steps[index].images[imgIndex]}
                     />
                  )}
                )}
                <FirebaseFileUploader
                  hidden={true}
                  buttonText="Upload picture"
                  storagePath={this.state._uploadImgPath}
                  onUploadSuccess={(fileInfo) => {
                    fields.push(fileInfo.downloadUrl);
                  }}
                />
              </React.Fragment>
            )}
          </FieldArray>
        </CardContent>
        { index >= 1 && (
          <div
            onClick={() => {
              this.handleModaleDeleteStepOpen()
            }}
            className="step-delete__button"
          >
            <span className="trash-icon" />
            <span>delete this step</span>
          </div>
        )}
      </Card>
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
        <DialogTitle
          id="alert-dialog-title"
          className="dialog-container"
        >
          {'Are you sure to delete this step ?'}
        </DialogTitle>
        <DialogActions className="dialog-buttons-container">
          <button
            className="dialog-button__cancel"
            onClick={() => {
              this.handleModaleDeleteStepClose()
            }}
          >
            Cancel
          </button>
          <button
            className="dialog-button__validate"
            onClick={() => {
              onDelete(index);
              this.handleModaleDeleteStepClose()
            }}
          >
            Yes
          </button>
        </DialogActions>
      </Dialog>
    </div>
    );
  }
}

export { Step };
