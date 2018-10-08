import * as React from "react";
import { Lock } from "@material-ui/icons";
import { IconButton, Modal } from "@material-ui/core";
import "./Home.scss";
import { LoginComponent } from "../../components/login";

export class HomePage extends React.Component {
  public state = {
    showLoginModal: false
  };
  public handleOpen = () => {
    this.setState({ showLoginModal: true });
  };

  public handleClose = () => {
    this.setState({ showLoginModal: false });
  };
  public render() {
    return (
      <div id="HomePage">
        <div className="bgimg-1">
          <div className="unlock">
            <IconButton color="primary" onClick={this.handleOpen}>
              <Lock />
            </IconButton>
          </div>
        </div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.showLoginModal}
          onClose={this.handleClose}
        >
          <div className="login-modal">
            Modal text?
            <LoginComponent />
          </div>
        </Modal>
      </div>
    );
  }
}
