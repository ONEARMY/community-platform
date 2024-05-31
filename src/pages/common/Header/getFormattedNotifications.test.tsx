import '@testing-library/jest-dom/vitest'

import { MemoryRouter } from 'react-router-dom'
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
      const { container } = render(
        <MemoryRouter>{notification.children}</MemoryRouter>,
      )
      expect(container).not.toBeEmptyDOMElement()
    })
  })
})
