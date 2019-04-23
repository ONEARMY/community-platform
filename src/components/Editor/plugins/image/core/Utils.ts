declare var XHR
declare var tinymce
import Settings from '../api/Settings'

const parseIntAndGetMax = (val1, val2) =>
  Math.max(parseInt(val1, 10), parseInt(val2, 10))

const getImageSize = (url, callback) => {
  const img = document.createElement('img')

  function done(width, height) {
    if (img.parentNode) {
      img.parentNode.removeChild(img)
    }

    callback({ width, height })
  }

  img.onload = () => {
    const width = parseIntAndGetMax(img.width, img.clientWidth)
    const height = parseIntAndGetMax(img.height, img.clientHeight)
    done(width, height)
  }

  img.onerror = () => {
    done(0, 0)
  }

  const style = img.style
  style.visibility = 'hidden'
  style.position = 'fixed'
  style.bottom = style.left = '0px'
  style.width = style.height = 'auto'

  document.body.appendChild(img)
  img.src = url
}

const buildListItems = (inputList, itemCallback, startItems?) => {
  function appendItems(values, output?) {
    output = output || []

    tinymce.Tools.each(values, item => {
      const menuItem: any = { text: item.text || item.title }

      if (item.menu) {
        menuItem.menu = appendItems(item.menu)
      } else {
        menuItem.value = item.value
        itemCallback(menuItem)
      }

      output.push(menuItem)
    })

    return output
  }

  return appendItems(inputList, startItems || [])
}

const removePixelSuffix = (value: string): string => {
  if (value) {
    value = value.replace(/px$/, '')
  }
  return value
}

const addPixelSuffix = (value: string): string => {
  if (value.length > 0 && /^[0-9]+$/.test(value)) {
    value += 'px'
  }
  return value
}

const mergeMargins = css => {
  if (css.margin) {
    const splitMargin = css.margin.split(' ')

    switch (splitMargin.length) {
      case 1: // margin: toprightbottomleft;
        css['margin-top'] = css['margin-top'] || splitMargin[0]
        css['margin-right'] = css['margin-right'] || splitMargin[0]
        css['margin-bottom'] = css['margin-bottom'] || splitMargin[0]
        css['margin-left'] = css['margin-left'] || splitMargin[0]
        break
      case 2: // margin: topbottom rightleft;
        css['margin-top'] = css['margin-top'] || splitMargin[0]
        css['margin-right'] = css['margin-right'] || splitMargin[1]
        css['margin-bottom'] = css['margin-bottom'] || splitMargin[0]
        css['margin-left'] = css['margin-left'] || splitMargin[1]
        break
      case 3: // margin: top rightleft bottom;
        css['margin-top'] = css['margin-top'] || splitMargin[0]
        css['margin-right'] = css['margin-right'] || splitMargin[1]
        css['margin-bottom'] = css['margin-bottom'] || splitMargin[2]
        css['margin-left'] = css['margin-left'] || splitMargin[1]
        break
      case 4: // margin: top right bottom left;
        css['margin-top'] = css['margin-top'] || splitMargin[0]
        css['margin-right'] = css['margin-right'] || splitMargin[1]
        css['margin-bottom'] = css['margin-bottom'] || splitMargin[2]
        css['margin-left'] = css['margin-left'] || splitMargin[3]
    }
    delete css.margin
  }
  return css
}

const waitLoadImage = (editor, data, imgElm) => {
  // tslint:disable-next-line:no-debugger
  debugger
  function selectImage() {
    imgElm.onload = imgElm.onerror = null

    if (editor.selection) {
      editor.selection.select(imgElm)
      editor.nodeChanged()
    }
  }

  imgElm.onload = () => {
    if (!data.width && !data.height && Settings.hasDimensions(editor)) {
      editor.dom.setAttribs(imgElm, {
        width: imgElm.clientWidth,
        height: imgElm.clientHeight,
      })
    }

    selectImage()
  }

  imgElm.onerror = selectImage
}

export default {
  getImageSize,
  buildListItems,
  removePixelSuffix,
  addPixelSuffix,
  mergeMargins,
  waitLoadImage,
}
