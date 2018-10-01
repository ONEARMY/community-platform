import * as React from "react";
import Slider from "react-slick";
import "./Tutorial.css";

import { TUTORIALS_MOCK } from "../../../../mocks/tutorials.mock";

const currentSlug = location.pathname.substr(
  location.pathname.lastIndexOf("/") + 1
);
const currentTutorial = TUTORIALS_MOCK.filter(
  tutorial => tutorial.slug === currentSlug
);
const settings = {
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

class Tutorial extends React.Component {
  public renderSliderContent() {
    return (
      <Slider {...settings}>
        {currentTutorial[0].steps.map(step =>
          step.images.map((imageUrl: any, index: any) => (
            <div key={index}>
              <img src={imageUrl} />
            </div>
          ))
        )}
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
        <h2>{currentTutorial[0].title}</h2>
        <span>
          <b>workspace : </b>
          {currentTutorial[0].workspace_name}
        </span>
        <span>{currentTutorial[0].cover_picture_url}</span>
        {currentTutorial[0].details.map((detail, index) => (
          <div key={index}>
            <p>cost : {detail.cost}</p>
            <p>difficulty : {detail.difficulty_level}</p>
            <p>time : {detail.time}</p>
          </div>
        ))}
        {currentTutorial[0].steps.map((step, index) => (
          <div key={index}>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
            {step.images.length > 1
              ? this.renderSliderContent()
              : this.renderUniqueImage(step.images[0])}
          </div>
        ))}
      </div>
    );
  }
}

export default Tutorial;
