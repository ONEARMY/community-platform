import * as React from 'react'
import { RouteComponentProps, withRouter, Switch } from 'react-router'
import { IHowtoFormInput } from 'src/models/howto.models'
import TEMPLATE from './Template'
import { HowtoStore } from 'src/stores/Howto/howto.store'

import { inject, observer } from 'mobx-react'
import { HowtoForm } from 'src/pages/Howto/Content/Common/Howto.form'
import { UserStore } from 'src/stores/User/user.store'
import { IUser } from 'src/models/user.models'
import { Text } from 'src/components/Text'
import { Flex } from 'rebass'

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
    const currentUser = this.injected.userStore.user as IUser
    return currentUser ? (
      <Switch>
        <HowtoForm
          formValues={formValues}
          parentType="create"
          {...this.props}
        />
      </Switch>
    ) : (
      <Flex justifyContent="center" mt="40px">
        <Text regular>Please login to access this page</Text>
      </Flex>
    )
  }
}

export default withRouter(CreateHowto)
