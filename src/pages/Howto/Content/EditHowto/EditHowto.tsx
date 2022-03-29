import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { IHowtoDB } from 'src/models/howto.models'
import { Redirect } from 'react-router'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { inject } from 'mobx-react'
import { toJS } from 'mobx'
import { HowtoForm } from 'src/pages/Howto/Content/Common/Howto.form'
import Text from 'src/components/Text'
import { IUser } from 'src/models/user.models'
import { isAllowToEditContent } from 'src/utils/helpers'
import { Loader } from 'src/components/Loader'
import { logger } from 'src/logger'

interface IState {
  formValues: IHowtoDB
  formSaved: boolean
  isLoading: boolean
  _toDocsList: boolean
  showSubmitModal?: boolean
  loggedInUser?: IUser | undefined
}
type IProps = RouteComponentProps<any>
interface IInjectedProps extends IProps {
  howtoStore: HowtoStore
}

@inject('howtoStore')
class EditHowto extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      formValues: {} as IHowtoDB,
      formSaved: false,
      _toDocsList: false,
      isLoading: true,
      loggedInUser: undefined,
    }
  }
  /* eslint-disable @typescript-eslint/naming-convention */
  public async UNSAFE_componentWillMount() {
    const loggedInUser = this.injected.howtoStore.activeUser
    if (this.injected.howtoStore.activeHowto! !== undefined) {
      this.setState({
        formValues: toJS(this.injected.howtoStore.activeHowto) as IHowtoDB,
        isLoading: false,
        loggedInUser: loggedInUser ? loggedInUser : undefined,
      })
    } else {
      const slug = this.props.match.params.slug
      const doc = await this.injected.howtoStore.setActiveHowtoBySlug(slug)
      this.setState({
        formValues: doc as IHowtoDB,
        isLoading: false,
        loggedInUser: loggedInUser ? loggedInUser : undefined,
      })
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }
  get store() {
    return this.injected.howtoStore
  }

  public render() {
    logger.debug('edit', this.state)
    const { formValues, isLoading, loggedInUser } = this.state
    if (formValues && !isLoading) {
      if (loggedInUser && isAllowToEditContent(formValues, loggedInUser)) {
        return (
          <HowtoForm
            formValues={formValues}
            parentType="edit"
            {...this.props}
          />
        )
      } else {
        return <Redirect to={'/how-to/' + formValues.slug} />
      }
    } else {
      return isLoading ? (
        <Loader />
      ) : (
        <Text txtcenter mt="50px" sx={{width: '100%'}}>
          How-to not found
        </Text>
      )
    }
  }
}
export default EditHowto
