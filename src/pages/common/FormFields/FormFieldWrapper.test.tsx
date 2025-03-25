import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'

import { LibraryFormProvider } from '../Library/Content/Common/LibraryFormProvider'
import { FormFieldWrapper } from './FormFieldWrapper'

describe('FormFieldWrapper', () => {
  it('renders the props', async () => {
    const text = 'Title Presented'
    const htmlFor = 'html_tag'
    const childrenText = 'Children rendered'

    render(
      <LibraryFormProvider>
        <FormFieldWrapper text={text} htmlFor={htmlFor}>
          <p>{childrenText}</p>
        </FormFieldWrapper>
      </LibraryFormProvider>,
    )

    await screen.findByText(text)
    await screen.findByText(childrenText)
  })

  it('adds an asterisk with required', async () => {
    const text = 'Title Presented'

    render(
      <LibraryFormProvider>
        <FormFieldWrapper text={text} required>
          <p></p>
        </FormFieldWrapper>
      </LibraryFormProvider>,
    )

    await screen.findByText('*', { exact: false })
  })
})
