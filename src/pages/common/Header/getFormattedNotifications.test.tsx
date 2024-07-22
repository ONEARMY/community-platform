import '@testing-library/jest-dom/vitest'

import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { createRoutesFromElements, Route } from '@remix-run/react'
import { render } from '@testing-library/react'
import { NotificationTypes } from 'oa-shared'
import { FactoryNotification } from 'src/test/factories/Notification'
import { describe, expect, it } from 'vitest'

import { getFormattedNotifications } from './getFormattedNotifications'

describe('getFormattedNotifications', () => {
  NotificationTypes.forEach((type) => {
    it(`returns a well formatted ${type} message`, () => {
      const [notification] = getFormattedNotifications([
        FactoryNotification({ type }),
      ])
      const router = createMemoryRouter(
        createRoutesFromElements(
          <Route index element={notification.children}></Route>,
        ),
      )

      const { container } = render(<RouterProvider router={router} />)
      expect(container).not.toBeEmptyDOMElement()
    })
  })
})
