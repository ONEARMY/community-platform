import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Form, Field } from "react-final-form";
import "./CreateTutorial.css";

import { storage } from "../../../../utils/firebase";
// The ts linter error from FileUploader import is ignored by utils/react-firebase-file-uploader.d.ts
import FileUploader from "react-firebase-file-uploader";

export interface IState {
  stepNb: number;
  cost: number;
  cover_picture_url: string;
  description: string;
  difficulty_level: string;
  id: string;
  slug: string;
  steps: [];
  time: number;
  title: string;
  workspace_name: string;
  isUploading: boolean;
  coverImgProgress: number;
  coverImgUrl: string;
}

const required = (value: any) => (value ? undefined : "Required");

class CreateTutorial extends React.PureComponent<
  RouteComponentProps<any>,
  IState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      stepNb: 1,
      cost: 0,
      cover_picture_url: "",
      description: "",
      difficulty_level: "easy",
      id: "",
      slug: "",
      steps: [],
      time: 0,
      title: "",
      workspace_name: "",
      isUploading: false,
      coverImgProgress: 0,
      coverImgUrl: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  public addStep = () => {
    this.setState({
      stepNb: this.state.stepNb + 1
    });
  };

  public sleep = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

  public async onSubmit(values: any) {
    console.log("submit");
    await this.sleep(300);
    window.alert(JSON.stringify(values));
  }

  public handleUploadStart = () => {
    this.setState({ isUploading: true, coverImgProgress: 0 });
  };
  public handleProgress = (coverImgProgress: any) => {
    console.log("handleProgress");
    this.setState({ coverImgProgress });
  };
  public handleUploadError = (error: any) => {
    this.setState({ isUploading: false });
    console.error(error);
  };
  public handleUploadSuccess = (filename: any) => {
    this.setState({ coverImgProgress: 100, isUploading: false });
    storage
      .ref("uploads")
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.setState({ coverImgUrl: url });
        console.log(this.state.coverImgUrl);
      });
  };

  public render() {
    const steps: any = [];
    for (let i = 1; i <= this.state.stepNb; i++) {
      steps.push(i);
    }
    return (
      <Form
        onSubmit={this.onSubmit}
        render={({ handleSubmit, pristine, values, invalid }) => (
          <form className="tutorial-form" onSubmit={handleSubmit}>
            <h2>Create tutorial</h2>
            <Field
              name="workspaceName"
              validate={required}
              placeholder="Workspace Name"
            >
              {({ input, meta }) => (
                <div>
                  <label>Workspace name</label>
                  <input {...input} type="text" placeholder="Last Name" />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
            <Field
              name="tutorialTitle"
              validate={required}
              placeholder="Tutorial title"
            >
              {({ input, meta }) => (
                <div>
                  <label>Tutorial title</label>
                  <input {...input} type="text" placeholder="Tutorial title" />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
            <label>Tutorial cover:</label>
            {this.state.isUploading && (
              <p>Progress: {this.state.coverImgProgress}</p>
            )}
            {this.state.coverImgUrl && <img src={this.state.coverImgUrl} />}
            <FileUploader
              accept="image/*"
              name="avatar"
              storageRef={storage.ref("uploads")}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
            />
            <Field
              name="tutorialDescription"
              validate={required}
              placeholder="Quick tutorial description"
            >
              {({ input, meta }) => (
                <div>
                  <label>Tutorial description</label>
                  <input
                    {...input}
                    type="text"
                    placeholder="Tutorial description"
                  />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>

            <div>
              <label>Difficulty</label>
              <Field name="difficulty" component="select">
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="difficult">difficult</option>
              </Field>
            </div>
            <Field name="tutorial_time" validate={required}>
              {({ input, meta }) => (
                <div>
                  <label>Time</label>
                  <input {...input} type="text" placeholder="Time needed" />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>
            <Field name="cost" validate={required}>
              {({ input, meta }) => (
                <div>
                  <label>Cost</label>
                  <input {...input} type="text" placeholder="The cost ? in $" />
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </div>
              )}
            </Field>

            <div>
              {steps.map((step: any, index: any) => {
                return (
                  <div key={index}>
                    <h3>Step {index + 1}</h3>
                    <p>step text</p>
                    <p>Image(s)</p>
                  </div>
                );
              })}
            </div>
            <button onClick={this.addStep}>ADD STEP</button>

            <button type="submit" disabled={pristine || invalid}>
              Submit
            </button>
          </form>
        )}
      />
    );
  }
}

export default CreateTutorial;
