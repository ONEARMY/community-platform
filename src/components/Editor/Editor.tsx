import { Editor as TinyMCE } from '@tinymce/tinymce-react'
import React from 'react'
import { config, VARIANT } from './config'
import { init } from './plugins'
import { load, isLoaded } from './common'
export * from './config'

export interface IEditorProps {
  variant: VARIANT
  content?: string
  placeholder?: string
  // onChange can return false, used to reject black listed words
  onChange: (content: string) => boolean
}
export class Editor extends React.Component<IEditorProps, any> {
  protected tinymce: TinyMCE | null
  constructor(props) {
    super(props)
    this.state = {
      content: props.content || '',
      loaded: isLoaded(),
    }
  }

  async componentWillMount() {
    await load()
    this.setState({ loaded: true })
    init()
  }

  content() {
    return this.state.content
  }

  isChanged() {
    return this.state.content !== this.props.content
  }

  render() {
    const { variant, placeholder } = this.props
    const { content, loaded } = this.state
    const conf = config(variant || VARIANT.SMALL)
    return (
      loaded && (
        <TinyMCE
          ref={ref => (this.tinymce = ref)}
          initialValue={placeholder}
          init={conf}
          onChange={this.handleEditorChange}
          value={content}
          onEditorChange={this.contentChange}
        />
      )
    )
  }

  // all kind of events go here
  private handleEditorChange = (args0, args1) => {
    // console.log('on change : ', args0, args1)
  }

  private contentChange = value => {
    const now = this.state.content
    if (value !== now) {
      if (this.props.onChange(value) === false) {
        // for some reason, tinymce - react component isn't using the content state
        ;(this.tinymce as any).editor.setContent(now)
        return
      }
      this.setState({ content: value })
    }
  }
}
