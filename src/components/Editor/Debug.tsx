import * as React from 'react'
import { observer } from 'mobx-react'
import MaxWidth from 'src/components/Layout/MaxWidth.js'
import { Box, Flex } from 'rebass'
import Margin from 'src/components/Layout/Margin.js'
import { Content, Main } from './elements'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { withRouter } from 'react-router'

import { Editor, VARIANT } from 'src/components/Editor'

class DebugEditor extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }
  public render() {
    return (
      <MaxWidth>
        <Box my={1.5}>
          <Content>
            <Box m={1.5}>
              <Flex alignItems="flex-start">
                <Editor
                  content={
                    '<p><img src="https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2Fdocumentation%2FaK47AtfNGVaMDfzSNfDP%2Fimage.png?alt=media&amp;token=92e4ec25-09eb-436e-bf7f-906f65dfdb16" alt="" data-mce-id="__mcenew" /></p>'
                  }
                  variant={VARIANT.SMALL}
                  onChange={content => {
                    console.log('content changed : ' + content)
                    return content.indexOf('shit shit shit fucking shit') === -1
                  }}
                />
              </Flex>
            </Box>
          </Content>
        </Box>
      </MaxWidth>
    )
  }
}
export const DebugEditorPage = withRouter(DebugEditor)
