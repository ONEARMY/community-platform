import { PluginNames } from './common'

export const TinyMCEUrl = (root: string = '') =>
  `${root}/vendor/tinymce/tinymce.min.js`

const DEFAULT_PLUGINS = `link image code emoticons hr autoresize code ${
  PluginNames.IMAGE
}`
const DEFAULT_TOOLBAR = `undo redo | bold italic |  alignleft aligncenter alignright | code ${
  PluginNames.IMAGE
}`

const SMALL_EDITOR = {
  PLUGINS: DEFAULT_PLUGINS,
  TOOLBAR: DEFAULT_TOOLBAR,
}

const DEFAULT_PROPS = {
  menubar: false,
  statusbar: false,
}

const VARIANT_SMALL = {
  ...DEFAULT_PROPS,
  ...{
    plugins: DEFAULT_PLUGINS,
    toolbar: DEFAULT_TOOLBAR,
  },
}

const VARIANT_INLINE = {
  ...DEFAULT_PROPS,
  ...{
    inline: true,
    plugins: DEFAULT_PLUGINS,
    toolbar: DEFAULT_TOOLBAR,
  },
}

export enum VARIANT {
  SMALL,
  COMMENT,
  POST,
  HOWTO,
  INLINE,
}

export const VARIANTS = {
  [VARIANT.SMALL]: VARIANT_SMALL,
  [VARIANT.INLINE]: VARIANT_INLINE,
}

export const config = (
  variant: VARIANT = VARIANT.SMALL,
  override: any = {},
) => {
  const defaultProps = { ...VARIANTS[variant] }
  return { ...defaultProps, ...override }
}
