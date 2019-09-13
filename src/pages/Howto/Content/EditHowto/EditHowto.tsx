import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { IHowto, IHowtoDB } from 'src/models/howto.models'
import { Redirect } from 'react-router'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { inject } from 'mobx-react'
import { toJS } from 'mobx'
import { HowtoForm } from 'src/pages/Howto/Content/Common/Howto.form'
import { Flex } from 'rebass'
import Heading from 'src/components/Heading'
import { IUser } from 'src/models/user.models'
import { isAllowToEditContent } from 'src/utils/helpers'

interface IState {
  formValues: IHowtoDB
  formSaved: boolean
  isLoading: boolean
  _toDocsList: boolean
  showSubmitModal?: boolean
  loggedInUser?: IUser | undefined
}
interface IProps extends RouteComponentProps<any> {}
interface IInjectedProps extends IProps {
  howtoStore: HowtoStore
}

@inject('howtoStore')
export class EditHowto extends React.Component<IProps, IState> {
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
  public async componentWillMount() {
    const loggedInUser = this.injected.howtoStore.rootStore.stores.userStore
      .user!
    if (this.injected.howtoStore.activeHowto! !== undefined) {
      this.setState({
        formValues: toJS(this.injected.howtoStore.activeHowto) as IHowtoDB,
        isLoading: false,
        loggedInUser: loggedInUser ? loggedInUser : undefined,
      })
    } else {
      const slug = this.props.match.params.slug
      const doc = await this.injected.howtoStore.getDocBySlug(slug)
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

  public onSubmit = async (formValues: IHowtoDB) => {
    this.setState({ showSubmitModal: true })
    console.log('onSubmit edit howto', formValues)

    await this.store.uploadHowTo(formValues)
  }

  public render() {
    console.log('edit', this.state)
    const { formValues, isLoading, loggedInUser } = this.state
    if (formValues && !isLoading) {
      if (loggedInUser && isAllowToEditContent(formValues, loggedInUser)) {
        return (
          <HowtoForm
            onSubmit={v => this.onSubmit(v as IHowtoDB)}
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
        <Flex>
          <Heading auxiliary txtcenter width={1}>
            loading...
          </Heading>
        </Flex>
      ) : (
        <div>How-to not found</div>
      )
    }
  }
}
