import Handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

// Should match the filenames in the templates folder.
export type SupportedEmailTemplates =
  | 'supporter-badge-removed'
  | 'supporter-badge-added'
  | 'verified-badge-added'
  | 'how-to-submission'
  | 'how-to-approval'
  | 'how-to-rejected'
  | 'how-to-needs-improvements'
  | 'map-pin-submission'
  | 'map-pin-approval'
  | 'map-pin-rejected'
  | 'map-pin-needs-improvements'
  | 'receiver-message'
  | 'sender-message'

export function getEmailHtml(emailType: SupportedEmailTemplates, ctx: {}) {
  const dirPath = path.resolve()

  const availableFiles = fs.readdirSync(path.join(path.resolve(), '/templates'))

  if (!availableFiles.includes(`${emailType}.html`)) {
    throw new Error(`Email template ${emailType} not found`)
  }

  const layoutTmpl = Handlebars.compile(
    fs.readFileSync(path.resolve(dirPath, './templates/layout.html'), 'utf-8'),
  )

  Handlebars.registerPartial('layout', layoutTmpl)

  const tmpl = Handlebars.compile(
    fs.readFileSync(
      path.resolve(dirPath, `./templates/${emailType}.html`),
      'utf-8',
    ),
  )

  return tmpl(ctx)
}
