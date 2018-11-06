import * as React from 'react';

import logo from "../../../assets/images/logo.png";
import './Header.scss';

const Header: React.StatelessComponent<{}> = () => {
  return (
    <header className="header">
      <img src={logo} className="logo" alt="logo" />
    </header>
  );
}

export default Header;
