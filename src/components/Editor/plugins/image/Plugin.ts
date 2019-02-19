declare var tinymce
import Commands from './api/Commands'
import FilterContent from './core/FilterContent'
import Buttons from './ui/Buttons'
import { PluginNames } from '../../common'

export const init = () => {
  tinymce.PluginManager.add(PluginNames.IMAGE, editor => {
    FilterContent.setup(editor)
    Buttons.register(editor)
    Commands.register(editor)
  })
}
