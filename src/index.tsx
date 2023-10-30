import * as ReactDOM from 'react-dom'
import { initErrorHandler } from './common/Error/handler'
import { App } from './App'

initErrorHandler()

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement)
