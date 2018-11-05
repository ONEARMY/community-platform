import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import "./CreateTutorial.scss";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ITutorialStep } from "../../../../models/tutorial.models";

import CloudUploadIcon from "../../../../assets/icons/upload.svg";
import DeleteIcon from "../../../../assets/icons/bin.svg";
import AddIcon from "../../../../assets/icons/add.svg";
import SaveIcon from "../../../../assets/icons/save.svg";

import { db } from "../../../../utils/firebase";

import { storage } from "../../../../utils/firebase";
import FileUploader from "react-firebase-file-uploader";
import { Redirect } from "react-router-dom";

export interface IState {
  formValues: IFormValues;
  _isUploading: boolean;
  _imgUploadProgress: number;
  _uploadImgPath: string;
  _uploadTutorialPath: string;
  _currentStepIndex: number;
  _toDocsList: boolean;
}
interface IFormValues {
  workspace_name: string;
  tutorial_title: string;
  tutorial_description: string;
  tutorial_time: string;
  tutorial_cost: string;
  difficulty_level: string;
  id: string;
  slug: string;
  steps: ITutorialStep[];
  cover_image_url: string;
  tutorial_extern_file_url: string;
  tutorial_files_url: string;
}

const styles = {
  card: {
    minWidth: 275,
    maxWidth: 600,
    margin: "20px auto"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  uploadBtn: {
    backgroundColor: "steelblue",
    color: "white",
    padding: 10,
    borderRadius: 4,
    cursor: "pointer"
  }
};

const required = (value: any) => (value ? undefined : "Required");

class CreateTutorial extends React.PureComponent<
  RouteComponentProps<any>,
  IState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      formValues: {
        tutorial_description: "",
        tutorial_title: "",
        tutorial_time: "",
        tutorial_cost: "",
        difficulty_level: "easy",
        cover_image_url: "",
        tutorial_extern_file_url: "",
        // "https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2Ftest%2FCapture%20d%E2%80%99e%CC%81cran%202018-10-16%20a%CC%80%2019.00.35.png?alt=media&token=f0e87108-f652-47fc-a507-53b1e91e5b77",
        tutorial_files_url: "",
        id: "",
        slug: "",
        steps: [
          {
            title: "",
            text: "",
            images: []
          },
          {
            title: "",
            text: "",
            images: []
          },
          {
            title: "",
            text: "",
            images: []
          }
        ],
        workspace_name: ""
      },
      _isUploading: false,
      _imgUploadProgress: 0,
      _uploadImgPath: "uploads/test",
      _currentStepIndex: 0,
      _uploadTutorialPath: "tutorials/test",
      _toDocsList: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  public onSubmit = async (values: any) => {
    if (this.state.formValues.cover_image_url === "") {
      alert("Please provide a cover image before saving your tutorial");
    } else {
      console.log("submitting", values);
      try {
        await db.doc(this.state._uploadTutorialPath).set({
          values
        });
        console.log("doc set successfully");
        this.props.history.push("/docs/list");
      } catch (error) {
        console.log("error while saving the tutorial");
      }
    }
  };

  public handleUploadStart = () => {
    this.setState({ _isUploading: true, _imgUploadProgress: 0 });
  };
  public handleProgress = (imgUploadProgress: any) => {
    this.setState({ _imgUploadProgress: imgUploadProgress });
  };
  public handleUploadError = (error: any) => {
    this.setState({ _isUploading: false });
    console.error(error);
  };
  public handleUploadCoverSuccess = (filename: string) => {
    this.setState({
      _imgUploadProgress: 100,
      _isUploading: false
    });
    storage
      .ref(this.state._uploadImgPath)
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.setState({
          formValues: { ...this.state.formValues, cover_image_url: url }
        });
      });
  };
  /* EXAMPLE
    You want to pass the step index to the handle upload step image success function
    When you have the url of the image you want to merge it with the existing step images
    Then merge the updated step with all steps and update the state
  */
  public handleUploadStepImgSuccess = async (filename: any) => {
    console.log("index", this.state._currentStepIndex);

    // untested code for reference - get the current steps
    const currentSteps: any = this.state.formValues.steps;
    // get the step at the index where the new image will go
    const url = await storage
      .ref(this.state._uploadImgPath)
      .child(filename)
      .getDownloadURL();
    // use the spread operator to merge the existing images with the new url
    currentSteps[this.state._currentStepIndex].images = [
      ...currentSteps[this.state._currentStepIndex].images,
      url
    ];
    this.setState({
      // additional meta fields if desired
      formValues: { ...this.state.formValues, steps: currentSteps },
      _imgUploadProgress: 100,
      _isUploading: false
    });
    console.log("this.state.formValues", this.state.formValues);
  };
  public handleUploadFilesSuccess = (filename: string) => {
    this.setState({
      _imgUploadProgress: 100,
      _isUploading: false
    });
    storage
      .ref(this.state._uploadImgPath)
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.setState({
          formValues: { ...this.state.formValues, tutorial_files_url: url }
        });
      });
  };

  public onInputChange = (event: any, inputType: string) => {
    // *** TODO the event.target.value needs to be formated as the article id
    switch (inputType) {
      case "tutorial_title":
        const clearUrl = event.target.value
          .replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",.<>\{\}\[\]\\\/]/gi, "")
          .split(" ")
          .join("-");
        this.setState({
          formValues: {
            ...this.state.formValues,
            tutorial_title: event.target.value,
            slug: encodeURIComponent(clearUrl)
          },
          _uploadImgPath: "uploads/" + event.target.value,
          _uploadTutorialPath: "tutorials/" + event.target.value
        });
        break;
      case "workspace_name":
        this.setState({
          formValues: {
            ...this.state.formValues,
            workspace_name: event.target.value
          }
        });
        break;
      case "tutorial_description":
        this.setState({
          formValues: {
            ...this.state.formValues,
            tutorial_description: event.target.value
          }
        });
        break;
      case "tutorial_time":
        this.setState({
          formValues: {
            ...this.state.formValues,
            tutorial_time: event.target.value
          }
        });
        break;
      case "tutorial_cost":
        this.setState({
          formValues: {
            ...this.state.formValues,
            tutorial_cost: event.target.value
          }
        });
        break;
      case "difficulty_level":
        this.setState({
          formValues: {
            ...this.state.formValues,
            difficulty_level: event.target.value
          }
        });
        break;
      case "tutorial_extern_file_url":
        // TODO check is proper url
        this.setState({
          formValues: {
            ...this.state.formValues,
            tutorial_extern_file_url: event.target.value
          }
        });

        break;

      default:
        break;
    }
  };

  public render() {
    return (
      <div>
        <Typography
          style={{ margin: "30px auto", display: "table" }}
          variant="h4"
          component="h4"
        >
          Create documentation
        </Typography>
        <Form
          onSubmit={this.onSubmit}
          initialValues={this.state.formValues}
          mutators={{
            ...arrayMutators
          }}
          render={({ handleSubmit, submitting, values, form, invalid }) => {
            return (
              <form className="create-tutorial-form" onSubmit={handleSubmit}>
                <div className="create-tutorial-infos__container">
                  <Typography
                    component="label"
                    className="create-tutorial__label"
                  >
                    What is your davehakkens.nl account ?
                  </Typography>
                  <Field
                    name="workspace_name"
                    validate={required}
                    placeholder="@janedoe"
                    className="create-tutorial__input"
                    component="input"
                    onBlur={(event: any) => {
                      this.onInputChange(event, "workspace_name");
                    }}
                  />
                  <Typography
                    component="label"
                    className="create-tutorial__label"
                  >
                    What is the title of your documentation ?
                  </Typography>
                  <Field name="tutorial_title" validate={required}>
                    {({ input, meta }) => (
                      <div>
                        <input
                          {...input}
                          style={{ width: "400px" }}
                          className="create-tutorial__input"
                          type="text"
                          onBlur={(event: any) => {
                            this.onInputChange(event, "tutorial_title");
                          }}
                          placeholder="How to make XXX using YYY"
                        />
                        {meta.error &&
                          meta.touched && <span>{meta.error}</span>}
                      </div>
                    )}
                  </Field>
                  {this.state._isUploading && (
                    <p>Progress: {this.state._imgUploadProgress}</p>
                  )}
                  {this.state.formValues.cover_image_url && (
                    <img
                      className="cover-img"
                      src={this.state.formValues.cover_image_url}
                      alt={
                        "cover image - " + this.state.formValues.tutorial_title
                      }
                    />
                  )}
                  <label className="upload-btn upload-btn--cover">
                    <span className="icon-separator">
                      <img src={CloudUploadIcon} alt="" />
                    </span>
                    <FileUploader
                      hidden
                      accept="image/png, image/jpeg"
                      name="coverImg"
                      storageRef={storage.ref(this.state._uploadImgPath)}
                      onUploadStart={this.handleUploadStart}
                      onUploadError={this.handleUploadError}
                      onUploadSuccess={this.handleUploadCoverSuccess}
                      onProgress={this.handleProgress}
                    />
                    Upload a cover image
                  </label>
                  <Typography
                    component="label"
                    className="create-tutorial__label"
                  >
                    Write a short description for the documentation
                  </Typography>
                  <Field name="tutorial_description" validate={required}>
                    {({ input, meta }) => (
                      <div>
                        <textarea
                          {...input}
                          placeholder="This is what we will do"
                          onBlur={(event: any) => {
                            this.onInputChange(event, "tutorial_description");
                          }}
                          style={{ width: "400px", height: "150px" }}
                          className="create-tutorial__input"
                        />
                        {meta.error &&
                          meta.touched && <span>{meta.error}</span>}
                      </div>
                    )}
                  </Field>
                  <Field name="tutorial_time" validate={required}>
                    {({ input, meta }) => (
                      <div>
                        <Typography
                          component="label"
                          className="create-tutorial__label"
                        >
                          How much time does it take ? (hours/week)
                        </Typography>
                        <input
                          {...input}
                          type="text"
                          className="create-tutorial__input"
                          placeholder="2 hours"
                          onBlur={(event: any) => {
                            this.onInputChange(event, "tutorial_time");
                          }}
                        />
                        {meta.error &&
                          meta.touched && <span>{meta.error}</span>}
                      </div>
                    )}
                  </Field>
                  <Field name="tutorial_cost" validate={required}>
                    {({ input, meta }) => (
                      <div>
                        <Typography
                          component="label"
                          className="create-tutorial__label"
                        >
                          How much does it cost ?
                        </Typography>
                        <input
                          {...input}
                          type="text"
                          className="create-tutorial__input"
                          onBlur={(event: any) => {
                            this.onInputChange(event, "tutorial_cost");
                          }}
                          placeholder="10$"
                        />
                        {meta.error &&
                          meta.touched && <span>{meta.error}</span>}
                      </div>
                    )}
                  </Field>
                  <Typography
                    component="label"
                    className="create-tutorial__label"
                  >
                    How difficult to replicate is your documentation ?
                  </Typography>
                  <Field
                    name="difficulty_level"
                    onBlur={(event: any) => {
                      this.onInputChange(event, "difficulty_level");
                    }}
                    component="select"
                    className="create-tutorial__input input--selector"
                  >
                    <option value="easy">easy</option>
                    <option value="medium">medium</option>
                    <option value="difficult">difficult</option>
                  </Field>
                  <Typography
                    component="label"
                    className="create-tutorial__label"
                  >
                    File to support your documentation ? (20mb max)
                  </Typography>
                  <label className="upload-btn upload-btn--files">
                    <span className="icon-separator">
                      <img src={CloudUploadIcon} alt="" />
                    </span>
                    <FileUploader
                      hidden
                      multiple={true}
                      name="files"
                      storageRef={storage.ref(this.state._uploadImgPath)}
                      onUploadStart={this.handleUploadStart}
                      onUploadError={this.handleUploadError}
                      onUploadSuccess={this.handleUploadFilesSuccess}
                      onProgress={this.handleProgress}
                    />
                    Upload a file
                  </label>
                  <Field name="tutorial_extern_file_url" validate={required}>
                    {({ input, meta }) => (
                      <div>
                        <Typography
                          component="label"
                          className="create-tutorial__label"
                        >
                          Or a link
                        </Typography>
                        <input
                          {...input}
                          type="text"
                          style={{ width: "400px" }}
                          className="create-tutorial__input"
                          placeholder="https://drive.google.com/drive/u/2/folders/..."
                          onBlur={(event: any) => {
                            this.onInputChange(
                              event,
                              "tutorial_extern_file_url"
                            );
                          }}
                        />
                        {meta.error &&
                          meta.touched && <span>{meta.error}</span>}
                      </div>
                    )}
                  </Field>
                </div>

                <div />

                <FieldArray name="steps">
                  {({ fields }) =>
                    fields.map((step, index) => (
                      <div className="step__container" key={index}>
                        <Card
                          key={step}
                          style={styles.card}
                          className="step__card"
                        >
                          <div className="step__header">
                            <Typography
                              variant="h5"
                              component="h2"
                              className="step-number"
                            >
                              Step {index + 1}
                            </Typography>
                          </div>
                          <CardContent>
                            <div>
                              <Typography
                                component="label"
                                className="create-tutorial__label"
                              >
                                Pick a title for this step
                              </Typography>
                              <Field
                                name={`${step}.title`}
                                component="input"
                                style={{ width: "400px" }}
                                placeholder="Step title"
                                validate={required}
                                className="create-tutorial__input"
                              />
                              <Typography
                                component="label"
                                className="create-tutorial__label"
                              >
                                Describe this step
                              </Typography>
                              <Field
                                name={`${step}.text`}
                                component="textarea"
                                placeholder="Description"
                                validate={required}
                                className="create-tutorial__input"
                                onBlur={() => {
                                  // update the state with the new values
                                  const stepValuesInput: any = form.getFieldState(
                                    "steps"
                                  )!.value;
                                  this.setState({
                                    formValues: {
                                      ...this.state.formValues,
                                      steps: stepValuesInput
                                    }
                                  });
                                }}
                                style={{ width: "400px", height: "150px" }}
                              />
                            </div>

                            {this.state.formValues.steps[index] &&
                              this.state.formValues.steps[index].images
                                .length >= 1 &&
                              this.state.formValues.steps[index].images.map(
                                (stepImg, stepImgindex) => (
                                  <img
                                    key={stepImgindex}
                                    className="step-img"
                                    src={stepImg}
                                  />
                                )
                              )}
                            <label className="upload-btn upload-btn--images">
                              <span className="icon-separator">
                                <img src={CloudUploadIcon} alt="" />
                              </span>
                              <FileUploader
                                hidden
                                name={`${step}.images`}
                                storageRef={storage.ref(
                                  this.state._uploadImgPath
                                )}
                                onUploadStart={this.handleUploadStart}
                                onUploadError={this.handleUploadError}
                                onUploadSuccess={
                                  this.handleUploadStepImgSuccess
                                }
                                onProgress={this.handleProgress}
                                onClick={() => {
                                  this.setState({ _currentStepIndex: index });
                                }}
                              />
                              Upload picture(s)
                            </label>
                          </CardContent>
                          {index >= 1 && (
                            <div
                              onClick={() => fields.remove(index)}
                              className="step-delete--button"
                            >
                              <img src={DeleteIcon} alt="" />
                              <span>delete this step</span>
                            </div>
                          )}
                        </Card>
                      </div>
                    ))
                  }
                </FieldArray>
                <button
                  className="add-step--button"
                  onClick={() => {
                    // create a empty step in the steps form value
                    form.mutators.push("steps", {
                      title: "",
                      text: "",
                      images: []
                    });
                    // update the state with the empty new step
                    const stepValuesInput: any = form.getFieldState("steps")!
                      .value;
                    this.setState({
                      formValues: {
                        ...this.state.formValues,
                        steps: stepValuesInput
                      }
                    });
                  }}
                >
                  <img src={AddIcon} alt="" />
                  <span>Add step</span>
                </button>
                <button
                  type="submit"
                  className="validate-form--button"
                  disabled={submitting || invalid}
                >
                  <img src={SaveIcon} alt="" />
                  <span>Save</span>
                </button>
              </form>
            );
          }}
        />
      </div>
    );
  }
}

export default CreateTutorial;
