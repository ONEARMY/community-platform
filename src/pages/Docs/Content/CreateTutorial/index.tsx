import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Form, Field } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import arrayMutators from "final-form-arrays";
import "./CreateTutorial.css";
import { ITutorialStep } from "../../../../models/tutorial.models";

import { storage } from "../../../../utils/firebase";
import FileUploader from "react-firebase-file-uploader";

export interface IState {
  formValues: IFormValues;
  _isUploading: boolean;
  _imgUploadProgress: number;
  _uploadPath: string;
}
interface IFormValues {
  cost: number;
  cover_picture_url: string;
  description: string;
  difficulty_level: string;
  id: string;
  slug: string;
  steps: ITutorialStep[];
  time: number;
  title: string;
  workspace_name: string;
  coverImgUrl: string;
  coverImgFilename: string;
}

const required = (value: any) => (value ? undefined : "Required");

class CreateTutorial extends React.PureComponent<
  RouteComponentProps<any>,
  IState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      formValues: {
        cost: 0,
        cover_picture_url: "",
        description: "",
        difficulty_level: "easy",
        id: "",
        slug: "",
        steps: [
          {
            title: "",
            text: ""
          },
          {
            title: "",
            text: ""
          },
          {
            title: "",
            text: ""
          }
        ],
        time: 0,
        title: "",
        workspace_name: "test",
        coverImgUrl: "",
        coverImgFilename: ""
      },
      _isUploading: false,
      _imgUploadProgress: 0,
      _uploadPath: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.preparePayload = this.preparePayload.bind(this);
  }

  public preparePayload = (values: any) => {
    console.log("values", values);
    // console.log("values length", Object.keys(values).length);
    // console.log("preparePayload");
    // const valuesArray = Object.keys(values).map(key => {
    //   return [String(key), values[key]];
    // });
    // console.log("valuesArray : ", valuesArray);
    // const payload: any = [];
    // const allSteps: any = [];
    // valuesArray.map((value: any, index: any) => {
    //   console.log("value : ", value);
    //   // const stepIndex: any = "step_" + (index + 1);
    //   console.log("valuesArray[index] :", valuesArray[index]);
    //   // for (let j = 0; j <= valuesArray.length; j++) {
    //   if (value.includes(valuesArray[index])) {
    //     console.log("inside if");
    //     allSteps.push(value);
    //   } else {
    //     console.log("inside else");
    //     payload.push(value);
    //   }
    //   // }
    // });
    // payload.push(allSteps);
    // console.log("payload : ", payload);
  };

  public onSubmit = async (values: any) => {
    console.log("submitting", values);
    // this.preparePayload(values);
    // await this.sleep(300);
    // window.alert(JSON.stringify(values));
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
      formValues: { ...this.state.formValues, coverImgFilename: filename },
      _isUploading: false
    });
    storage
      .ref(this.state._uploadPath)
      .child(filename)
      .getDownloadURL()
      .then(url => {
        this.setState({
          formValues: { ...this.state.formValues, coverImgUrl: url }
        });
      });
  };
  /* EXAMPLE
    You want to pass the step index to the handle upload step image success function
    When you have the url of the image you want to merge it with the existing step images
    Then merge the updated step with all steps and update the state
  */
  public handleUploadStepImgSuccess = async (filename: any, index: number) => {
    // untested code for reference - get the current steps
    const steps: any = this.state.formValues.steps;
    // get the step at the index where the new image will go
    const url = await storage
      .ref(this.state._uploadPath)
      .child(filename)
      .getDownloadURL();
    steps[index] = {
      // use the spread operator to merge the existing images with the new url
      // it should create a new array if one doesn't already exist
      images: [...steps[index].images, url]
    };
    // u
    this.setState({
      // additional meta fields if desired
      _imgUploadProgress: 100,
      _isUploading: false
    });
  };

  public onChangeHandlerStepImg = (event: any) => {
    const {
      target: { files }
    } = event;
    const filesToStore: any = [];
    console.log("files :", files);
    for (const f of files) {
      console.log("f :", f);
      filesToStore.push(f);
    }
    // this.setState({ _stepsImgUrl: filesToStore });
  };

  public onTitleChange = (event: any) => {
    // *** TODO the event.target.value needs to be formated as the article id
    this.setState({ _uploadPath: "uploads/" + event.target.value });
  };

  public displayStepImgUpload = (stepIndex: any) => {
    return (
      <FileUploader
        accept="image/*"
        name={"step" + stepIndex + "_image"}
        storageRef={storage.ref(this.state._uploadPath)}
        onUploadStart={this.handleUploadStart}
        onUploadError={this.handleUploadError}
        onUploadSuccess={this.handleUploadStepImgSuccess}
        onProgress={this.handleProgress}
      />
    );
  };

  public render() {
    return (
      <Form
        onSubmit={this.onSubmit}
        initialValues={this.state}
        mutators={{
          ...arrayMutators
        }}
        render={({
          handleSubmit,
          mutators: { push, pop }, // injected from final-form-arrays above
          pristine,
          reset,
          submitting,
          values
        }) => {
          return (
            <form className="tutorial-form" onSubmit={handleSubmit}>
              <h2>Create Tutorial</h2>
              <div>
                <label>Workspace Name</label>
                <Field
                  name="workspace_name"
                  validate={required}
                  placeholder="Workspace Name"
                  component="input"
                />
              </div>
              <div className="buttons">
                <button type="button" onClick={() => push("steps", undefined)}>
                  Add Step
                </button>
                <button type="button" onClick={() => pop("steps")}>
                  Remove Step
                </button>
              </div>
              <FieldArray name="steps">
                {({ fields }) =>
                  fields.map((name, index) => (
                    <div key={name}>
                      <label>Step {index + 1}</label>
                      <Field
                        name={`${name}.title`}
                        component="input"
                        placeholder="Step title"
                        validate={required}
                      />
                      <Field
                        name={`${name}.text`}
                        component="input"
                        placeholder="Description"
                        validate={required}
                      />
                      <span
                        onClick={() => fields.remove(index)}
                        style={{ cursor: "pointer" }}
                      >
                        ❌
                      </span>
                    </div>
                  ))
                }
              </FieldArray>

              <div className="buttons">
                <button type="submit" disabled={submitting || pristine}>
                  Submit
                </button>
              </div>
              {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
            </form>
            // <Field>
            //             <label>Workspace name</label>
            //             <input {...input} type="text" placeholder="Last Name" />
            //             {meta.error && meta.touched && <span>{meta.error}</span>}
            //           </div>
            //         )}
            //       </Field>
            //       <Field name="tutorial_title" validate={required}>
            //         {({ input, meta }) => (
            //           <div>
            //             <label>Tutorial title</label>
            //             <input
            //               {...input}
            //               type="text"
            //               onBlur={this.onTitleChange}
            //               placeholder="Tutorial title"
            //             />
            //             {meta.error && meta.touched && <span>{meta.error}</span>}
            //           </div>
            //         )}
            //       </Field>
            //       <label>Tutorial cover:</label>
            //       {this.state.isUploading && (
            //         <p>Progress: {this.state.imgUploadProgress}</p>
            //       )}
            //       {this.state.coverImgUrl && (
            //         <img
            //           className="cover-img"
            //           src={this.state.coverImgUrl}
            //           alt={"cover image - " + this.state.title}
            //         />
            //       )}
            //       <FileUploader
            //         accept="image/png, image/jpeg"
            //         name="coverImg"
            //         storageRef={storage.ref(this.state.uploadPath)}
            //         onUploadStart={this.handleUploadStart}
            //         onUploadError={this.handleUploadError}
            //         onUploadSuccess={(e)=>this.handleUploadCoverSuccess(e,index)}
            //         onProgress={this.handleProgress}
            //       />
            //       <Field
            //         name="tutorial_description"
            //         validate={required}
            //         placeholder="Quick tutorial description"
            //       >
            //         {({ input, meta }) => (
            //           <div>
            //             <label>Tutorial description</label>
            //             <input
            //               {...input}
            //               type="text"
            //               placeholder="Tutorial description"
            //             />
            //             {meta.error && meta.touched && <span>{meta.error}</span>}
            //           </div>
            //         )}
            //       </Field>

            //       <div>
            //         <label>Difficulty</label>
            //         <Field name="difficulty" component="select">
            //           <option value="easy">easy</option>
            //           <option value="medium">medium</option>
            //           <option value="difficult">difficult</option>
            //         </Field>
            //       </div>
            //       <Field name="tutorial_time" validate={required}>
            //         {({ input, meta }) => (
            //           <div>
            //             <label>Time</label>
            //             <input {...input} type="text" placeholder="Time needed" />
            //             {meta.error && meta.touched && <span>{meta.error}</span>}
            //           </div>
            //         )}
            //       </Field>
            //       <Field name="cost" validate={required}>
            //         {({ input, meta }) => (
            //           <div>
            //             <label>Cost</label>
            //             <input {...input} type="text" placeholder="The cost ? in $" />
            //             {meta.error && meta.touched && <span>{meta.error}</span>}
            //           </div>
            //         )}
            //       </Field>

            //       <p>File(s)</p>
            //       <FileUploader
            //         multiple={true}
            //         name="files"
            //         storageRef={storage.ref(this.state.uploadPath)}
            //         onUploadStart={this.handleUploadStart}
            //         onUploadError={this.handleUploadError}
            //         onUploadSuccess={this.handleUploadCoverSuccess}
            //         onProgress={this.handleProgress}
            //       />

            //       <div>
            //
            //       </div>
            //       <button onClick={this.addStep}>ADD STEP</button>
            //       <button type="submit" disabled={pristine || invalid}>
            //         Submit
            //       </button>
            //     </form>
          );
        }}
      />
    );
  }
}

export default CreateTutorial;
