import * as React from 'react';

import logo from "../../../assets/images/logo.png";
import './MainLayout.scss';

const MainLayout: React.StatelessComponent<{}> = ({ children }) => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      {children}
    </div>
  );
}

export default MainLayout;
