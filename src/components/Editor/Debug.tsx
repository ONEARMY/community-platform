import * as React from 'react'
import Main from 'src/pages/common/Layout/Main'
import { withRouter } from 'react-router'

import { Editor, VARIANT } from 'src/components/Editor'

class DebugEditor extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }
  public render() {
    return (
      <Main>
        <Editor
          content={
            '<p><img src="https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2Fdocumentation%2FaK47AtfNGVaMDfzSNfDP%2Fimage.png?alt=media&amp;token=92e4ec25-09eb-436e-bf7f-906f65dfdb16" alt="" data-mce-id="__mcenew" /></p>'
          }
          variant={VARIANT.SMALL}
          onChange={content => {
            console.log('content changed : ' + content)
          }}
        />
      </Main>
    )
  }
}
export const DebugEditorPage = withRouter(DebugEditor)
