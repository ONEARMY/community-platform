// to add the image upload popup dialog, we need to append the app's root
// with a new node
export const AppRoot = () => document.getElementById('root') as HTMLElement
export const NewAppNode = () => {
  const div = document.createElement('div')
  AppRoot().appendChild(div)
  return div
}
