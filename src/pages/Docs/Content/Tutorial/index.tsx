import * as React from "react";
import { RouteComponentProps } from "react-router";
import Slider from "react-slick";
import "./Tutorial.css";

import { TUTORIALS_MOCK } from "../../../../mocks/tutorials.mock";

export interface IState {
  tutorial: {};
}

const sliderSettings = {
  centerMode: false,
  arrows: true,
  dots: true,
  infinite: true,
  speed: 500,
  customPaging: (i: any) => (
    <div
      style={{
        width: "30px",
        color: "black",
        border: "1px black solid"
      }}
    >
      {i + 1}
    </div>
  )
};

class Tutorial extends React.PureComponent<RouteComponentProps<any>, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      tutorial: TUTORIALS_MOCK.filter(
        tutorial => tutorial.slug === this.props.match.params.slug
      )
    };
  }

  public renderSliderContent(step: any) {
    return (
      <Slider {...sliderSettings}>
        {step.images.map((imageUrl: any, index: any) => (
          <div key={index}>
            <img src={imageUrl} />
          </div>
        ))}
      </Slider>
    );
  }

  public renderUniqueImage(url: string) {
    return (
      <div>
        <img src={url} />
      </div>
    );
  }
  public render() {
    return (
      <div>
        <h2>{this.state.tutorial[0].title}</h2>
        <span>
          <b>workspace : </b>
          {this.state.tutorial[0].workspace_name}
        </span>
        <span>{this.state.tutorial[0].cover_picture_url}</span>
        {this.state.tutorial[0].details.map((detail: any, index: number) => (
          <div key={index}>
            <p>cost : {detail.cost}</p>
            <p>difficulty : {detail.difficulty_level}</p>
            <p>time : {detail.time}</p>
          </div>
        ))}
        {this.state.tutorial[0].steps.map((step: any, index: number) => (
          <div key={index}>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            {step.images.length > 1
              ? this.renderSliderContent(step)
              : this.renderUniqueImage(step.images[0])}
          </div>
        ))}
      </div>
    );
  }
}

export default Tutorial;
