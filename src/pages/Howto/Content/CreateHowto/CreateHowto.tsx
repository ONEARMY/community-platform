import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router'
import { IHowtoFormInput } from 'src/models/howto.models'
import TEMPLATE from './Template'
import { HowtoStore } from 'src/stores/Howto/howto.store'

import { inject, observer } from 'mobx-react'
import { HowtoForm } from 'src/pages/Howto/Content/Common/Howto.form'
import { UserStore } from 'src/stores/User/user.store'

interface IState {
  formValues: IHowtoFormInput
  formSaved: boolean
  _toDocsList: boolean
}
interface IProps extends RouteComponentProps<any> {}
interface IInjectedProps extends IProps {
  userStore: UserStore
  howtoStore: HowtoStore
}

@inject('userStore')
@observer
class CreateHowto extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    // generate unique id for db and storage references and assign to state
    this.state = {
      formValues: { ...TEMPLATE.INITIAL_VALUES } as IHowtoFormInput,
      formSaved: false,
      _toDocsList: false,
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }

  public render() {
    const { formValues } = this.state
    return (
      <HowtoForm formValues={formValues} parentType="create" {...this.props} />
    )
  }
}

export default withRouter(CreateHowto)
