import * as React from 'react'
import type { RouteComponentProps } from 'react-router'
import type { IHowtoDB } from 'src/models/howto.models'
import { Redirect } from 'react-router'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import { inject } from 'mobx-react'
import { toJS } from 'mobx'
import { HowtoForm } from 'src/pages/Howto/Content/Common/Howto.form'
import { Text } from 'theme-ui'
import type { IUser } from 'src/models/user.models'
import { isAllowToEditContent } from 'src/utils/helpers'
import { Loader } from 'oa-components'
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
    if (this.injected.howtoStore.activeHowto) {
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
    logger.debug(this.state, 'EditHowto.render')
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
        <Text mt="50px" sx={{ width: '100%', textAlign: 'center' }}>
          How-to not found
        </Text>
      )
    }
  }
}
export default EditHowto
