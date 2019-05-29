import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { TagsStore } from 'src/stores/Tags/tags.store'
import { Button } from 'src/components/Button'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'

// we include props from react-final-form fields so it can be used as a custom field component
interface IProps {
  tagsStore?: TagsStore
}
interface IState {
  disabled: boolean
  msg?: string
}

@inject('tagsStore')
@observer
export class AdminTags extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      disabled: false,
    }
  }

  async uploadTags() {
    this.setState({ disabled: true })
    try {
      await this.props.tagsStore!.uploadTagsMockToDatabase()
      this.setState({ msg: 'Tags Uploaded Successfully' })
    } catch (error) {
      this.setState({ disabled: false, msg: 'Error: See console' })
    }
  }
  public render() {
    return (
      <>
        <Heading small>Tags Admin</Heading>
        <Button
          disabled={this.state.disabled}
          variant={this.state.disabled ? 'disabled' : 'dark'}
          onClick={() => this.uploadTags()}
        >
          Populate Tags from Mock
        </Button>
        <Text mt={2}>{this.state.msg}</Text>
      </>
    )
  }
}
