import { fireEvent, render, waitFor } from '@testing-library/react'
import { NavLink, BrowserRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'

import { HowtoForm } from './Howto.form'
declare const window: any

describe('Howto form', () => {
  let howtoStore
  let tagsStore
  let formValues
  let parentType

  beforeAll(() => {
    window.confirm = jest.fn(() => true)
  })

  beforeEach(() => {
    howtoStore = {
      uploadStatus: {
        Start: false,
        Cover: false,
        'Step Images': false,
        Files: false,
        Database: false,
        Complete: false,
      },
    }
    tagsStore = {
      categoryTags: [
        {
          categories: ['how-to'],
          label: 'test tag 1',
          image: 'test img',
        },
      ],
      setTagsCategory: () => {},
    }
    formValues = {
      files: [],
      tags: {},
      moderation: 'draft',
    }
    parentType = 'create'

    window.confirm.mockReset()
  })

  it.skip('should not show the confirm dialog', async () => {
    let renderResult
    const navProps: any = {}
    await waitFor(() => {
      renderResult = render(
        <Provider howtoStore={howtoStore} tagsStore={tagsStore}>
          <BrowserRouter>
            <NavLink to="/how-to">Test link</NavLink>
            <HowtoForm
              formValues={formValues}
              parentType={parentType}
              {...navProps}
            />
          </BrowserRouter>
        </Provider>,
      )
    })

    const testLink = await renderResult.findByText(/Test link/)
    fireEvent.click(
      testLink,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(window.confirm).not.toBeCalled()
  })

  it.skip('should show the confirm dialog, title change', async () => {
    let renderResult
    const navProps: any = {}
    await waitFor(() => {
      renderResult = render(
        <Provider howtoStore={howtoStore} tagsStore={tagsStore}>
          <BrowserRouter>
            <NavLink to="/how-to">Test link</NavLink>
            <HowtoForm
              formValues={formValues}
              parentType={parentType}
              {...navProps}
            />
          </BrowserRouter>
        </Provider>,
      )
    })

    const titleInput = await renderResult.findByLabelText(/Title/)

    fireEvent.change(titleInput, { target: { value: 'Test title' } })

    const testLink = await renderResult.findByText(/Test link/)
    fireEvent.click(
      testLink,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    )

    expect(window.confirm).toBeCalled()
  })
})
