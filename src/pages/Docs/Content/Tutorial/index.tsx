import * as React from "react";
import "./Tutorial.css";

import { TUTORIALS_MOCK } from "../../../../mocks/tutorials.mock";

class Tutorial extends React.Component {
  public render() {
    const currentSlug = location.pathname.substr(
      location.pathname.lastIndexOf("/") + 1
    );
    const currentTutorial = TUTORIALS_MOCK.filter(
      tutorial => tutorial.slug === currentSlug
    );
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
          </div>
        ))}
      </div>
    );
  }
}

export default Tutorial;
