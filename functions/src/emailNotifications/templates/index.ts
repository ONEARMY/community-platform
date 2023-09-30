import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

type SupportedEmailTemplates =
  | 'supporter-badge-removed'
  | 'supporter-badge-added'
  | 'how-to-rejected'
  | 'map-pin-rejected'
  | 'verified-badge-added'

export function getEmailHtml(emailType: SupportedEmailTemplates, ctx: {}) {
  const layoutTmpl = Handlebars.compile(
    fs.readFileSync(
      path.resolve(__dirname, '../templates/layout.html'),
      'utf-8',
    ),
  )

  Handlebars.registerPartial('layout', layoutTmpl)

  const tmpl = Handlebars.compile(
    fs.readFileSync(
      path.resolve(__dirname, `../templates/${emailType}.html`),
      'utf-8',
    ),
  )

  return tmpl(ctx)
}
