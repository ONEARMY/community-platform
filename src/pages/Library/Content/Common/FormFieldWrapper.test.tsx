import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'

import { FormFieldWrapper } from './FormFieldWrapper'
import { HowtoFormProvider } from './LibraryFormProvider'

describe('FormFieldWrapper', () => {
  it('renders the props', async () => {
    const text = 'Title Presented'
    const htmlFor = 'html_tag'
    const childrenText = 'Children rendered'

    render(
      <HowtoFormProvider>
        <FormFieldWrapper text={text} htmlFor={htmlFor}>
          <p>{childrenText}</p>
        </FormFieldWrapper>
      </HowtoFormProvider>,
    )

    await screen.findByText(text)
    await screen.findByText(childrenText)
  })

  it('adds an asterisk with required', async () => {
    const text = 'Title Presented'

    render(
      <HowtoFormProvider>
        <FormFieldWrapper text={text} required>
          <p></p>
        </FormFieldWrapper>
      </HowtoFormProvider>,
    )

    await screen.findByText('*', { exact: false })
  })
})
