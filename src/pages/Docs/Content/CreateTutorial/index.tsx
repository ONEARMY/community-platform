import * as React from "react";
import { RouteComponentProps } from "react-router";
// import Slider from "react-slick";
import "./CreateTutorial.css";

export interface IState {
  stepNb: number;
}

class CreateTutorial extends React.PureComponent<
  RouteComponentProps<any>,
  IState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      stepNb: 1
    };

    this.addStep = this.addStep.bind(this);
  }

  public addStep() {
    this.setState({
      stepNb: this.state.stepNb + 1
    });
  }

  public render() {
    const steps = [];
    for (let i = 1; i <= this.state.stepNb; i++) {
      steps.push(i);
    }
    return (
      <div>
        <span>
          <b>EDIT MODE : </b>
        </span>
        <div>
          <p>cost : </p>
          <p>difficulty : </p>
          <p>time : </p>
        </div>
        <div>
          {steps.map((step, index) => {
            return (
              <div key={index}>
                <h3>step title</h3>
                <p>step text</p>
              </div>
            );
          })}
        </div>
        <button onClick={this.addStep}>ADD STEP</button>
      </div>
    );
  }
}

export default CreateTutorial;
