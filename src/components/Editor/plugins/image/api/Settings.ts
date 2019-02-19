const hasDimensions = editor => {
  return editor.settings.image_dimensions === false ? false : true
}

const getClassList = editor => {
  return editor.getParam('image_class_list')
}

export default {
  hasDimensions,
  getClassList  
}
