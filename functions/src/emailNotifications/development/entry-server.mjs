import { getEmailHtml } from '../templates/index'
import fs from 'fs'
import path from 'path'
import { PP_PROJECT_IMAGE, PP_PROJECT_NAME, PP_SIGNOFF } from '../constants'
import { faker } from '@faker-js/faker'

export function render(url) {
  const availableTemplates = fs
    .readdirSync(path.resolve(__dirname, '../templates'))
    .filter((f) => !['index.ts', 'layout.html'].includes(f))
    .map((f) => f.replace('.html', ''))

  const template = url.replace(/^\//g, '')
  if (availableTemplates.includes(template)) {
    const html = getEmailHtml(template, {
      user: {
        displayName: faker.name.fullName(),
      },
      site: {
        name: PP_PROJECT_NAME,
        image: PP_PROJECT_IMAGE,
        url: 'https://community.preciousplastic.com',
        signOff: PP_SIGNOFF,
      },
      howto: {
        title: 'Mock Howto Title',
        comments: 'Mock Howto Moderation Comments',
      },
      mappin: {
        comments: 'Mock Mappin Moderation Comments',
      },
    })
    return html
  }

  return (
    `Available Templates
` +
    availableTemplates
      .map(
        (template) =>
          `<li><a href="/${template}" style="text-transform: capitalize">${template.replace(
            /-/g,
            ' ',
          )}</a></li>`,
      )
      .join('\n')
  )
}
// ctx.modules is now a Set of module IDs that were used during the render
