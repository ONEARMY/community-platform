import * as React from 'react'

import { withRouter } from 'react-router'

interface IProps {}

class MapsPageClass extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    return <div>Ik heb een mapje</div>
  }
}

export const MapsPage = withRouter(MapsPageClass as any)
