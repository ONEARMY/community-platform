import { Editor as TinyMCE } from '@tinymce/tinymce-react'
import React from 'react'
import { config, VARIANT } from './config'
import { init } from './plugins'
import { load, isLoaded } from './common'
export * from './config'
import { sanitize } from 'dompurify'

const before = content => sanitize(content)

export interface IEditorProps {
  variant: VARIANT
  content?: string
  placeholder?: string
  // onChange can return false, used to reject black listed words
  onChange: (content: string) => void
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
          value={content}
          onEditorChange={this.contentChange}
        />
      )
    )
  }

  private contentChange = value => {
    const sanitized = before(value)
    this.props.onChange(sanitized as string)
    this.setState({ content: sanitized })
  }
}
