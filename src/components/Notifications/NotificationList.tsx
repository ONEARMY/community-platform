import React, { useState } from 'react'
import { useCommonStores } from 'src'
import Flex from 'src/components/Flex'

import { NotificationItem } from 'src/components/Notifications/NotificationItem'

import { INotification } from 'src/models'


interface IProps {
    notifications?: INotification[]
}


// TODO: Expect the comments as a prop from the HowTo
export const NotificationList = ({ notifications }: IProps) => {
    //const { stores } = useCommonStores()
    console.log(notifications);
    notifications?.forEach(n => console.log(n.triggeredByName))

    return (
        <div>
            {notifications &&
                notifications.map(notification => {
                    return (
                        <NotificationItem key={notification._id} {...notification} />
                    )
                })}
        </div>
    )
}
