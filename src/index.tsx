import { createRoot } from 'react-dom/client'
import { initErrorHandler } from './common/Error/handler'
import { App, useCommonStores } from './App'

initErrorHandler()

export { useCommonStores }

const container = document.getElementById('root')
const root = createRoot(container!)

if (root) {
  root.render(<App />)
}
