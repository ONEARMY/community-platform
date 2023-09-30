import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

// Should match the filenames in the templates folder.
export type SupportedEmailTemplates =
  | 'supporter-badge-removed'
  | 'supporter-badge-added'
  | 'how-to-rejected'
  | 'map-pin-rejected'
  | 'verified-badge-added'
  | 'how-to-needs-improvements'
  | 'map-pin-needs-improvements'

export function getEmailHtml(emailType: SupportedEmailTemplates, ctx: {}) {
  const availableFiles = fs.readdirSync(path.resolve(__dirname, '../templates'))
  if (!availableFiles.includes(`${emailType}.html`)) {
    throw new Error(`Email template ${emailType} not found`)
  }

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
