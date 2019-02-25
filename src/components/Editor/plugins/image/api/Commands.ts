import Dialog from '../ui/Dialog'
import { PluginNames } from '../../../common'

const register = editor =>
  editor.addCommand(PluginNames.IMAGE, Dialog(editor).open)

export default {
  register,
}
