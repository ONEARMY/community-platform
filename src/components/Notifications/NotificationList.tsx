import { NotificationItem } from 'src/components/Notifications/NotificationItem'
import type { INotification } from 'src/models'

interface IProps {
  notifications?: INotification[]
}

export const NotificationList = ({ notifications }: IProps) => {
  return (
    <div>
      {notifications &&
        notifications.map((notification) => {
          return <NotificationItem key={notification._id} {...notification} />
        })}
    </div>
  )
}
