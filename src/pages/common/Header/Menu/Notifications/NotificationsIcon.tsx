import { Component } from 'react'
import Flex from 'src/components/Flex'
import Icon from 'src/components/Icons'

interface IProps {
    onCLick: () => void
}

function NotificationsIcon({onCLick}) {
        return (
            <>
                <Flex ml={1} onClick={onCLick}>
                    <Icon glyph="thunderbolt" size={40} color={"orange"} />
                </Flex>
            </>
        )
}

export default NotificationsIcon
