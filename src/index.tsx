import * as ReactDOM from 'react-dom'
import { initErrorHandler } from './common/errors'
import { App, useCommonStores } from './App'

initErrorHandler()

export { useCommonStores }

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
