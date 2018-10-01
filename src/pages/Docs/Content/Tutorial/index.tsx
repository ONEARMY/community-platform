import * as React from "react";
import "./Tutorial.css";

import { TUTORIALS_MOCK } from "../../../../mocks/tutorials.mock";

class Tutorial extends React.Component {
  public render() {
    return (
      <div>
        {TUTORIALS_MOCK.map(tutorial => (
          <React.Fragment key={tutorial.id}>
            <dd>{tutorial.description}</dd>
          </React.Fragment>
        ))}
      </div>
    );
  }
}

export default Tutorial;
