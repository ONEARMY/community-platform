import '@testing-library/jest-dom/vitest'

import {
  createMemoryRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { NotificationTypes } from '@onearmy.apps/shared'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FactoryNotification } from '../../../test/factories/Notification'
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
