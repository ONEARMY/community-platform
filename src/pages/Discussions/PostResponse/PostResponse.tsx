import * as React from 'react'
import { inject } from 'mobx-react'
import { IStores } from 'src/stores'
import { DiscussionsStore } from 'src/stores/Discussions/discussions.store'
import { IDiscussionComment } from 'src/models/discussions.models'
import { Editor, VARIANT } from 'src/components/Editor/'
import { Button } from 'src/components/Button/'
import { BoxContainer } from 'src/components/Layout/BoxContainer'

interface IProps {
  comment: IDiscussionComment
}

interface IInjected extends IProps {
  discussionsStore: DiscussionsStore
}

interface IState {
  showEditor: boolean
  editorInput: string
  isSaving: boolean
  repliesTo?: string
}

@inject((allStores: IStores) => ({
  discussionsStore: allStores.discussionsStore,
}))
export class PostResponse extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = { showEditor: false, editorInput: '', isSaving: false }
  }
  get injected() {
    return this.props as IInjected
  }
  editorChanged(content: string) {
    this.setState({ editorInput: content })
    return true
  }
  toggleEditor() {
    console.log(
      'responding to comment',
      this.props.comment._id,
      'parent discussion',
      this.props.comment._discussionID,
    )
    this.setState({
      showEditor: !this.state.showEditor,
    })
  }
  async addResponse() {
    this.setState({ isSaving: true })
    try {
      await this.injected.discussionsStore.createComment(
        this.props.comment._discussionID,
        this.state.editorInput,
        this.props.comment._id,
      )
      console.log('comment added successfully')
      this.setState({
        editorInput: '',
        isSaving: false,
      })
    } catch (error) {
      console.log('error', error)
      throw new Error(JSON.stringify(error))
    }
  }

  public render() {
    const c = this.props.comment
    return (
      <BoxContainer display={'inline-block'}>
        <div dangerouslySetInnerHTML={{ __html: c.comment }} />
        <Button onClick={() => this.toggleEditor()}>Reply</Button>
        {this.state.showEditor ? (
          <>
            <Editor
              variant={VARIANT.SMALL}
              content={this.state.editorInput}
              onChange={content => this.editorChanged(content)}
            />
            <Button
              type="submit"
              icon={'check'}
              onClick={() => this.addResponse()}
              disabled={this.state.editorInput === '' || this.state.isSaving}
            >
              Submit
            </Button>
          </>
        ) : null}
      </BoxContainer>
    )
  }
}
