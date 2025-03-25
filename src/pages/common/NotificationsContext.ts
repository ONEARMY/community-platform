import { createContext } from 'react'

import type { Notification } from 'oa-shared'

type INotificationsContext = Notification[] | null

export const NotificationsContext = createContext<INotificationsContext>(null)
