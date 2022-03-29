import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps, Switch, withRouter } from 'react-router'
import { Flex } from 'theme-ui'
import { Text } from 'src/components/Text'
import { IResearch } from 'src/models/research.models'
import { IUser } from 'src/models/user.models'
import ResearchForm from 'src/pages/Research/Content/Common/Research.form'
import { ResearchStore } from 'src/stores/Research/research.store'
import { UserStore } from 'src/stores/User/user.store'
import TEMPLATE from './Template'

interface IState {
  formValues: IResearch.FormInput
  formSaved: boolean
  _toDocsList: boolean
}
type IProps = RouteComponentProps<any>
interface IInjectedProps extends IProps {
  userStore: UserStore
  researchStore: ResearchStore
}

@inject('userStore')
@observer
class CreateResearch extends React.Component<RouteComponentProps, IState> {
  constructor(props: any) {
    super(props)

    this.state = {
      formValues: { ...TEMPLATE.INITIAL_VALUES } as IResearch.FormInput,
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
        <ResearchForm
          formValues={formValues}
          parentType="create"
          {...this.props}
        />
      </Switch>
    ) : (
      <Flex sx={{justifyContent: "center"}} mt="40px">
        <Text regular>Please login to access this page</Text>
      </Flex>
    )
  }
}

export default withRouter(CreateResearch)
