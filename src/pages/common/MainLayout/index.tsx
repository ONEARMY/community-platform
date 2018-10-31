import * as React from 'react';

import Header from "../Header";

import logo from "../../../assets/images/logo.png";
import './MainLayout.scss';

const MainLayout: React.StatelessComponent<{}> = ({ children }) => {
  return (
    <div className="App">
      <Header />
      {children}
    </div>
  );
}

export default MainLayout;
