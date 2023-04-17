import styled from '@emotion/styled'
import { observer } from 'mobx-react'
import { NotificationItem } from 'oa-components'
import { useCallback, useEffect, useState } from 'react'
import { Box, Text } from 'theme-ui'
import { useDB } from 'src/App'
import type { INotification, IPendingEmails } from 'src/models'
import { getFormattedNotificationMessage } from 'src/pages/common/Header/getFormattedNotifications'
import Table from '../components/Table/Table'
import type { ICellRenderProps, ITableProps } from '../components/Table/Table'

type IPendingEmailsDBDoc = Record<string, IPendingEmails>

const EMAILS_PENDING_COLUMNS: ITableProps<IPendingEmails>['columns'] = [
  {
    Header: 'User ID',
    accessor: '_userId',
  },
  {
    Header: 'Frequency',
    accessor: 'emailFrequency',
  },
  {
    Header: 'Notifications',
    accessor: 'notifications',
  },
]
const NotificationListContainer = styled(Box)`
  overflow: auto;
  height: 6rem;
`

const AdminNotifictions = observer(() => {
  const { db } = useDB()
  const [emailsPending, setEmailsPending] = useState<IPendingEmails[]>([])

  // Load list of pending approvals on mount only, dependencies empty to avoid reloading
  useEffect(() => {
    getPendingEmails()
  }, [])

  const getPendingEmails = useCallback(async () => {
    db.collection<IPendingEmailsDBDoc>('user_notifications')
      .doc('emails_pending')
      .stream()
      .subscribe((emailsPending) => {
        if (emailsPending) {
          const values = Object.entries(emailsPending).map(
            ([_userId, value]) => ({ ...value, _userId }),
          )
          if (values.length > 0) {
            setEmailsPending(values)
          }
        }
      })
  }, [])

  /** Function applied to render each table row cell */
  const RenderContent: React.FC<ICellRenderProps> = (
    props: ICellRenderProps,
  ) => {
    const { col } = props
    const { field, value } = col
    const tableField = field as keyof IPendingEmails
    if (!value) return null
    if (tableField === 'notifications') {
      const notifications = value as INotification[]
      return (
        <NotificationListContainer>
          {notifications.map((n) => (
            <NotificationItem key={n._id} type={n.type}>
              {getFormattedNotificationMessage(n)}
            </NotificationItem>
          ))}
        </NotificationListContainer>
      )
    }
    return <Text>{`${value}`}</Text>
  }

  return (
    <>
      <h2>Admin Notifictions</h2>
      <h4>Pending Emails</h4>
      <Table
        data={emailsPending}
        columns={EMAILS_PENDING_COLUMNS}
        rowComponent={RenderContent}
      />
    </>
  )
})
export default AdminNotifictions
