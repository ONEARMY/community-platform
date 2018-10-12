/******************************************************************************  
This is the Home Page main component, rendering content seen at '/'
*******************************************************************************/

import * as React from "react";
import "./Home.scss";
import { LoginContainer } from "../../containers/Login.container";
import { IUser } from "../../models/models";

interface IState {
  isLoggedIn: boolean;
}
export class HomePage extends React.Component<any, any> {
  // userUpdated is a callback function passed back up from the login container to track if the user has logged in
  // we could also use the global state for this, but for now sufficient
  public userUpdated = (user: IUser) => {
    this.setState({ isLoggedIn: user ? true : false });
  };
  public render() {
    return (
      <div id="HomePage">
        <LoginContainer notifyUserUpdate={this.userUpdated} />
        {this.state && this.state.isLoggedIn ? (
          <div>User Logged in page</div>
        ) : (
          <div className="bgimg-1" />
        )}
      </div>
    );
  }
}
