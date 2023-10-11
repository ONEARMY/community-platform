import { getEmailHtml, SupportedEmailTemplates } from '.'

jest.mock('fs', () => ({
  readdirSync: () => ['verified-badge-added.html'],
  readFileSync: () => '<html></html>',
}))

jest.mock('handlebars', () => ({
  registerPartial: jest.fn(),
  compile: jest.fn((txt) => jest.fn(() => txt)),
}))

describe('getEmailHtml', () => {
  it('throws an error for templates not in directory', () => {
    expect(() =>
      getEmailHtml('not-a-template' as SupportedEmailTemplates, {}),
    ).toThrowError('Email template not-a-template not found')
  })

  it('returns a template for file in directory', () => {
    const template = getEmailHtml('verified-badge-added', {})
    expect(template).toEqual('<html></html>')
  })
})
