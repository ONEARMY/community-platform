import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { IStores } from 'src/stores'
import { computed } from 'mobx'
import { DiscussionsStore } from 'src/stores/Discussions/discussions.store'
import { withRouter, RouteComponentProps } from 'react-router'
import { IDiscussionPost } from 'src/models/discussions.models'
import { Editor, VARIANT } from 'src/components/Editor/'
import { Button } from 'src/components/Button/'
import { PostResponse } from '../PostResponse/PostResponse'
import PageContainer from 'src/components/Layout/PageContainer'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import Heading from 'src/components/Heading'

interface IProps extends RouteComponentProps {
  discussionsStore: DiscussionsStore
}
interface IState {
  editorInput: string
  isSaving: boolean
}

@inject((allStores: IStores) => ({
  discussionsStore: allStores.discussionsStore,
}))
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
@observer
class PostViewClass extends React.Component<IProps, IState> {
  @computed get post() {
    return this.props.discussionsStore.activeDiscussion
  }
  @computed get comments() {
    return this.props.discussionsStore.allDiscussionComments
  }
  constructor(props: any) {
    super(props)
    this.state = { editorInput: '', isSaving: false }
  }
  componentDidMount() {
    const params = this.props.match.params as any
    this.props.discussionsStore.setActiveDiscussion(params.slug)
  }
  editorChanged(content: string) {
    this.setState({ editorInput: content })
    return true
  }
  async createComment(postId) {
    console.log('adding comment', this.state.editorInput)
    this.setState({ isSaving: true })
    try {
      await this.props.discussionsStore.createComment(
        postId,
        this.state.editorInput,
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
  // should probably be it's own component
  PostView(p: IDiscussionPost) {
    return (
      <>
        <h1>Question</h1>
        <div>{p.title}</div>
        <div dangerouslySetInnerHTML={{ __html: p.content }} />
        <h2>Responses</h2>
      </>
    )
  }

  public render() {
    if (this.post) {
      const p = this.post
      return (
        <PageContainer>
          <BoxContainer display={'inline-block'}>
            <Heading as={'h1'}>{p.title}</Heading>
            <div dangerouslySetInnerHTML={{ __html: p.content }} />
          </BoxContainer>
          <h2>Responses</h2>
          <BoxContainer display={'inline-block'}>
            {this.comments.map(c => (
              <PostResponse key={c._id} comment={c} />
            ))}
          </BoxContainer>
          <h2>Add response</h2>
          <BoxContainer display={'inline-block'}>
            <Editor
              variant={VARIANT.SMALL}
              content={this.state.editorInput}
              onChange={content => this.editorChanged(content)}
            />
            <Button
              type="submit"
              icon={'check'}
              onClick={() => this.createComment(p._id)}
              disabled={this.state.editorInput === '' || this.state.isSaving}
            >
              Submit
            </Button>
          </BoxContainer>
        </PageContainer>
      )
    } else {
      return null
    }
  }
}
export const PostView = withRouter(PostViewClass as any)
