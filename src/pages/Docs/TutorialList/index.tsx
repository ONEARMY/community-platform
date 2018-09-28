import * as React from "react";
import "./TutorialList.css";

import { TUTORIALS_MOCK } from "../../../mocks/tutorials.mock";

class TutorialList extends React.Component {
  public render() {
    return (
      <div>
        {TUTORIALS_MOCK.map(tutorial => (
          <React.Fragment key={tutorial.id}>
            <p>{tutorial.title}</p>
            <dd>{tutorial.description}</dd>
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default TutorialList;
