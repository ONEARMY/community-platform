import React from 'react'

import { NotificationItem } from 'src/components/Notifications/NotificationItem'
import { INotification } from 'src/models'


interface IProps {
    notifications?: INotification[]
}


// TODO: Expect the comments as a prop from the HowTo
export const NotificationList = ({ notifications }: IProps) => {

    return (
        <div style={{padding: '0em 0.9em 0em 0.9em'}}>
            {notifications &&
                notifications.map(notification => {
                    return (
                        <NotificationItem key={notification._id} {...notification} />
                    )
                })} 
        </div>
    )
}
