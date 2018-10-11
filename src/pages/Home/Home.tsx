/******************************************************************************  
This is the Home Page main component, rendering content seen at '/'
*******************************************************************************/

import * as React from "react";
import "./Home.scss";
import { LoginContainer } from "../../containers/Login.container";

export class HomePage extends React.Component<any, any> {
  public render() {
    return (
      <div id="HomePage">
        <div className="bgimg-1">
          <LoginContainer />
        </div>
        {/*  */}
      </div>
    );
  }
}
