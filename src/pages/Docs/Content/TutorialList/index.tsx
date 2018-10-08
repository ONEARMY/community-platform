import * as React from "react";
import "./TutorialList.css";
import { Link } from "react-router-dom";

import { TUTORIALS_MOCK } from "../../../../mocks/tutorials.mock";

class TutorialList extends React.Component {
  public render() {
    return (
      <div>
        {TUTORIALS_MOCK.map(tutorial => (
          <React.Fragment key={tutorial.id}>
            <Link to={`/docs/${tutorial.slug}`}>{tutorial.title}</Link>
            <dd>{tutorial.description}</dd>
          </React.Fragment>
        ))}
        <Link className="create-btn" to={`/docs/create`}>
          Create new
        </Link>
      </div>
    );
  }
}

export default TutorialList;
