/******************************************************************************  
This is the Home Page main component, rendering content seen at '/'
It is also functions as a container, linked to the global state     
*******************************************************************************/

import * as React from "react";
import { Lock, LockOpen } from "@material-ui/icons";
import { IconButton, Modal } from "@material-ui/core";
import "./Home.scss";
import { LoginComponent } from "../../components/login";
import { IStoreState } from "../../redux/store";
import { connect } from "react-redux";

// internal state properties
interface IInternalState {
  showLoginModal: boolean;
  loggedIn?: boolean;
}
// props from parent - we don't have any being passed so just for demonstration
interface IOwnProps {
  propFromParent: number;
}
// global state properties
interface IStateProps {
  loggedIn: boolean;
}

// dispatch events
interface IDispatchProps {
  onSomeEvent: () => void;
}

// overall component props are a combination of state, dispatch and own props
type IProps = IStateProps & IDispatchProps & IOwnProps;

class HomePage extends React.Component<IProps, IInternalState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showLoginModal: false
    };
  }
  public logout = () => {
    console.log("logging out");
  };
  public openLogin = () => {
    this.setState({ showLoginModal: true });
  };
  public closeLogin = () => {
    this.setState({ showLoginModal: false });
  };
  public render() {
    return (
      <div id="HomePage">
        <div className="bgimg-1">
          <div className="login-icon">
            {this.props.loggedIn ? (
              <IconButton color="primary" onClick={this.logout}>
                <Lock />
                Log out
              </IconButton>
            ) : (
              <IconButton color="primary" onClick={this.openLogin}>
                <LockOpen />
                Log in
              </IconButton>
            )}
          </div>
        </div>
        <Modal
          aria-labelledby="user-login-modal"
          aria-describedby="click to show user login"
          open={this.state.showLoginModal}
          onClose={this.closeLogin}
        >
          <div className="login-modal">
            <LoginComponent />
          </div>
        </Modal>
      </div>
    );
  }
}

// required functions and bindings for the home page to pick global state variables
// and propagate to component. This could be extracted to a higher layer container
const mapStateToProps = (state: IStoreState, ownProps: IProps) => ({
  loggedIn: state.user.loggedIn
});

const mapDispatchToProps = (state: IStoreState) => ({
  //
});

export default connect(
  mapStateToProps,
  null
)(HomePage);

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };
