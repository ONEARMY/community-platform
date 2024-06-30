import { createRoot } from 'react-dom/client'

import { initErrorHandler } from './common/Error/handler'
import { App } from './App'

initErrorHandler()

const container = document.getElementById('root')
const root = createRoot(container!)
root.render(<App />)
