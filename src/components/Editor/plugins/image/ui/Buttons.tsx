import Dialog from './Dialog'
const register = editor => {
  editor.addButton('fbimage', {
    icon: 'image',
    tooltip: 'Insert/Edit image',
    onclick: Dialog(editor).open,
    stateSelector:
      'img:not([data-mce-object],[data-mce-placeholder]),figure.image',
  })

  editor.addMenuItem('fbimage', {
    icon: 'image',
    text: 'Image',
    onclick: Dialog(editor).open,
    context: 'insert',
    prependToContext: true,
  })
}

export default {
  register,
}
