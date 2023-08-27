import { render, screen } from '@testing-library/react'
import { HowtoProvider } from 'src/test/components'

import { FormFieldWrapper } from '.'

describe('FormFieldWrapper', () => {
  it('renders the props', async () => {
    const text = 'Title Presented'
    const htmlFor = 'html_tag'
    const childrenText = 'Children rendered'

    render(
      <HowtoProvider>
        <FormFieldWrapper text={text} htmlFor={htmlFor}>
          <p>{childrenText}</p>
        </FormFieldWrapper>
      </HowtoProvider>,
    )

    await screen.findByText(text)
    await screen.findByText(childrenText)
  })

  it('adds an asterisk with required', async () => {
    const text = 'Title Presented'

    render(
      <HowtoProvider>
        <FormFieldWrapper text={text} required>
          <p></p>
        </FormFieldWrapper>
      </HowtoProvider>,
    )

    await screen.findByText('*', { exact: false })
  })
})
