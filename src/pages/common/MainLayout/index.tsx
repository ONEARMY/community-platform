import * as React from 'react'
import Header from '../Header/Header'
import './MainLayout.scss'

const MainLayout: React.StatelessComponent<{}> = ({ children }) => {
  return <div className="App">{children}</div>
}

export default MainLayout
