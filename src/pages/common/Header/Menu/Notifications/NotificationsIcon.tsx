import Flex from 'src/components/Flex'
import Icon from 'src/components/Icons'

function NotificationsIcon({onCLick, isMobileMenuActive, areThereNotifications}) {
        return (
            <>
                <Flex ml={1} onClick={onCLick} style={isMobileMenuActive ? {backgroundColor: "#e2edf7", borderRadius: "5px"} : {}}>
                    <Icon glyph="thunderbolt" size={40} color={areThereNotifications ? "gold" : "#bfbfbf"} />
                </Flex>
            </>
        )
}

export default NotificationsIcon
