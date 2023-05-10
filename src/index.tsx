import * as ReactDOM from 'react-dom'
import { App, useCommonStores } from './App'
import { initErrorHandler } from './common/Error/handler'

initErrorHandler()

export { useCommonStores }

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
