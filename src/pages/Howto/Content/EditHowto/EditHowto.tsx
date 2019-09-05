import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { IHowtoFormInput } from 'src/models/howto.models'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { inject } from 'mobx-react'
import { toJS } from 'mobx'
import { HowtoForm } from 'src/pages/Howto/Content/Common/Howto.form'
import { Flex } from 'rebass'
import Heading from 'src/components/Heading'

interface IState {
  formValues: IHowtoFormInput
  formSaved: boolean
  isLoading: boolean
  _toDocsList: boolean
  showSubmitModal?: boolean
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
      formValues: {} as IHowtoFormInput,
      formSaved: false,
      _toDocsList: false,
      isLoading: true,
    }
  }
  public async componentWillMount() {
    if (this.injected.howtoStore.activeHowto! !== undefined) {
      this.setState({
        formValues: toJS(
          this.injected.howtoStore.activeHowto,
        ) as IHowtoFormInput,
        isLoading: false,
      })
    } else {
      const slug = this.props.match.params.slug
      const doc = await this.injected.howtoStore.getDocBySlug(slug)
      this.setState({
        formValues: doc as IHowtoFormInput,
        isLoading: false,
      })
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }
  get store() {
    return this.injected.howtoStore
  }

  public onSubmit = async (formValues: IHowtoFormInput) => {
    this.setState({ showSubmitModal: true })
    console.log('onSubmit edit howto', formValues)

    // await this.store.editHowTo(formValues, this.state._docID)
  }

  public render() {
    const { formValues, isLoading } = this.state
    if (formValues) {
      return (
        <HowtoForm
          onSubmit={v => this.onSubmit(v)}
          formValues={formValues}
          parentType="edit"
          {...this.props}
        />
      )
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
