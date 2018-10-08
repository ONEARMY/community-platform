import * as React from "react";
import { Lock } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import "./Home.scss";

export class HomePage extends React.Component {
  public render() {
    return (
      <div id="HomePage">
        <div className="bgimg-1">
          <div className="unlock">
            <IconButton color="primary">
              <Lock />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}
