import { getEmailHtml } from '../templates/index'
import fs from 'fs'
import path from 'path'
import { PP_PROJECT_IMAGE, PP_PROJECT_NAME, PP_SIGNOFF } from '../constants'
import { faker } from '@faker-js/faker'

export function render(url) {
  const availableTemplates = fs
    .readdirSync(path.resolve(__dirname, './templates'))
    .filter((f) => f.endsWith('.html') && f !== 'layout.html')
    .map((f) => f.replace('.html', ''))

  const template = url.replace(/^\//g, '')
  if (availableTemplates.includes(template)) {
    const html = getEmailHtml(template, {
      user: {
        displayName: faker.person.fullName(),
      },
      site: {
        name: PP_PROJECT_NAME,
        image: PP_PROJECT_IMAGE,
        url: 'https://community.preciousplastic.com',
        signOff: PP_SIGNOFF,
      },
      howto: {
        title: 'Mock Howto Title',
        moderatorFeedback: 'Mock Howto Moderation Comment',
        slug: 'mock-howto-title',
      },
      mapPin: {
        moderatorFeedback: 'Mock Mappin Moderation Comments',
        _id: 'mock-mappin-id',
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
