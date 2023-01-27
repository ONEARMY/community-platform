import { render } from '@testing-library/react'
import { randomUUID } from 'crypto'
import { MemoryRouter } from 'react-router'
import { NotificationTypes } from 'src/models'
import { getFormattedMessage } from './getFormattedNotifications'

describe('getFormattedNotifications', () => {
  NotificationTypes.forEach((type) => {
    it('provides formatted message for ' + type, () => {
      const message = getFormattedMessage({
        type,
        userId: randomUUID(),
        triggeredBy: {
          userId: randomUUID(),
        },
      } as any)
      const { container } = render(<MemoryRouter>{message}</MemoryRouter>)
      expect(container).not.toBeEmptyDOMElement()
    })
  })
})
