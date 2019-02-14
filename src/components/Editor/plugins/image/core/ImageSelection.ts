import {
  defaultData,
  read,
  ImageData,
  create,
  isFigure
} from '../core/ImageData'
import Utils from '../core/Utils'

const normalizeCss = (editor: any, cssText: string): string => {
  const css = editor.dom.styles.parse(cssText)
  const mergedCss = Utils.mergeMargins(css)
  const compressed = editor.dom.styles.parse(
    editor.dom.styles.serialize(mergedCss),
  )
  return editor.dom.styles.serialize(compressed)
}

const getSelectedImage = (editor: any): any => {
  const imgElm = editor.selection.getNode() as HTMLElement
  const figureElm = editor.dom.getParent(imgElm, 'figure.image') as HTMLElement

  if (figureElm) {
    return editor.dom.select('img', figureElm)[0]
  }

  if (
    imgElm &&
    (imgElm.nodeName !== 'IMG' ||
      imgElm.getAttribute('data-mce-object') ||
      imgElm.getAttribute('data-mce-placeholder'))
  ) {
    return null
  }

  return imgElm
}

const splitTextBlock = (editor: any, figure: HTMLElement) => {
  const dom = editor.dom

  const textBlock = dom.getParent(
    figure.parentNode,
    node => {
      return editor.schema.getTextBlockElements()[node.nodeName]
    },
    editor.getBody(),
  )

  if (textBlock) {
    return dom.split(textBlock, figure)
  } else {
    return figure
  }
}

const readImageDataFromSelection = (editor: any): ImageData => {
  const image = getSelectedImage(editor)
  return image ? read(css => normalizeCss(editor, css), image) : defaultData()
}

const insertImageAtCaret = (editor: any, data: ImageData) => {
  const elm = create(css => normalizeCss(editor, css), data)

  editor.dom.setAttrib(elm, 'data-mce-id', '__mcenew')
  editor.focus()
  editor.selection.setContent(elm.outerHTML)

  const insertedElm = editor.dom.select('*[data-mce-id="__mcenew"]')[0]
  editor.dom.setAttrib(insertedElm, 'data-mce-id', null)

  if (isFigure(insertedElm)) {
    const figure = splitTextBlock(editor, insertedElm)
    editor.selection.select(figure)
  } else {
    editor.selection.select(insertedElm)
  }
}

const syncSrcAttr = (editor: any, image: HTMLElement) => {
  editor.dom.setAttrib(image, 'src', image.getAttribute('src'))
}

const deleteImage = (editor: any, image: HTMLElement) => {
  if (image) {
    const elm = editor.dom.is(image.parentNode, 'figure.image')
      ? image.parentNode
      : image

    editor.dom.remove(elm)
    editor.focus()
    editor.nodeChanged()

    if (editor.dom.isEmpty(editor.getBody())) {
      editor.setContent('')
      editor.selection.setCursorLocation()
    }
  }
}

/*
const writeImageDataToSelection = (editor: any, data: ImageData) => {
  const image = getSelectedImage(editor)

  write(css => normalizeCss(editor, css), data, image)
  syncSrcAttr(editor, image)

  if (isFigure(image.parentNode)) {
    const figure = image.parentNode as HTMLElement
    splitTextBlock(editor, figure)
    editor.selection.select(image.parentNode)
  } else {
    editor.selection.select(image)
    Utils.waitLoadImage(editor, data, image)
  }
}
*/

const insertOrUpdateImage = (editor: any, data: ImageData) => {
  const image = getSelectedImage(editor)
  if (image) {
    if (data.src) {
      // writeImageDataToSelection(editor, data)
    } else {
      deleteImage(editor, image)
    }
  } else if (data.src) {
    insertImageAtCaret(editor, data)
  }
}

export { normalizeCss, readImageDataFromSelection, insertOrUpdateImage }
