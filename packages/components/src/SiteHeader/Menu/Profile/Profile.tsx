import Foco from 'react-foco'
import { Box, Flex } from 'theme-ui'
import { ProfileModal } from '../ProfileModal/ProfileModal'
import { MenuMobileLink } from '../MenuMobile/MenuMobileLink'
import { ProfileButtons } from './ProfileButtons'
import { MemberBadge } from '../../../MemberBadge/MemberBadge'
import { useState } from 'react'

interface IProps {
  isMobile: boolean
  user: any
  pageList: any[]
}

export const Profile = (props: IProps) => {
  const { user, pageList } = props
  const [showProfileModal, setShowProfileModal] = useState(false)
  return (
    <>
      {user ? (
        props.isMobile ? (
          <Box
            sx={{
              borderBottom: 'none',
              borderColor: 'lightgrey',
              borderTop: '1px solid',
              mt: 1,
            }}
          >
            <MenuMobileLink path={'/u/' + user.userName} content={'Profile'} />
            {pageList.map((page) => (
              <MenuMobileLink
                path={page.path}
                key={page.path}
                content={page.title}
              />
            ))}
            <MenuMobileLink
              path={window.location.pathname}
              content={'Log out'}
            />
          </Box>
        ) : (
          <div data-cy="user-menu">
            <Flex
              onClick={() => setShowProfileModal(!showProfileModal)}
              ml={1}
              sx={{ height: '100%' }}
            >
              <MemberBadge profileType={user.profileType} />
            </Flex>
            <Flex>
              {showProfileModal && (
                <Foco
                  onClickOutside={() => setShowProfileModal(!showProfileModal)}
                >
                  <ProfileModal username={user.userName} />
                </Foco>
              )}
            </Flex>
          </div>
        )
      ) : (
        <ProfileButtons isMobile={props.isMobile} />
      )}
    </>
  )
}
