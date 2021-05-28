/**
 * TODO CC 2021-05-28 - Review if this is still useful
 */

import { array, text, boolean, number, color } from '@storybook/addon-knobs'

const isColor = (strColor: string): boolean => {
  const style = new Option().style
  style.color = strColor
  const test1 = style.color === strColor
  const test2 = /^#[0-9A-F]{6}$/i.test(strColor)
  return test1 === true || test2 === true
}

export const knobsFactory = (
  element: any,
  name: string = 'props',
  parent: string = '',
) => {
  if (Array.isArray(element)) {
    return array(name, element, ', ')
  }

  if (typeof element === 'string') {
    if (isColor(element)) {
      return color(name, element, parent)
    }
    return text(name, element, parent)
  }

  if (typeof element === 'number') {
    return number(name, element, {}, parent)
  }

  if (typeof element === 'boolean') {
    return boolean(name, element, parent)
  }

  const keys = Object.keys(element)

  if (keys.length > 0) {
    return keys.reduce((accum, current) => {
      return {
        ...accum,
        [current]: knobsFactory(element[current], current, name),
      }
    }, {})
  }

  return element
}
