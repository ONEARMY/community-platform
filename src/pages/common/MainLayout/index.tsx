import * as React from 'react'

import Header from '../Header'

const MainLayout: React.StatelessComponent<{}> = ({ children }) => {
  return (
    <div className="App">
      <Header />
      {children}
    </div>
  )
}

export default MainLayout
