import React from 'react'
import { Box } from 'theme-ui'
import { Flex } from 'theme-ui'
import { INotification } from 'src/models'
import { Link } from 'src/components/Links'
import { ReactComponent as IconComment } from 'src/assets/icons/icon-comment.svg'
import { ReactComponent as IconUseful } from 'src/assets/icons/icon-useful.svg'

export interface IProps extends INotification {}

export const NotificationItem: React.FC<IProps> = ({
  triggeredBy,
  relevantUrl,
  type,
}) => {
  return (
    <Flex
      bg={'white'}
      data-cy="notification"
      sx={{
        flexDirection: 'column',
        width: '100%',
        fontSize: '12px',
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: '1px solid #c7c7c7',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {type === 'howto_useful' ? (
        <Flex style={{ textAlign: 'left', color: 'black' }}>
          <IconUseful
            width="15px"
            height="15px"
            style={{ marginRight: '10px', opacity: '0.6' }}
          />
          <Box>
            Yay,
            <Link
              style={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
                fontWeight: '500',
              }}
              to={'/u/' + triggeredBy.userId}
              display="inline"
            >
              {triggeredBy.displayName}
            </Link>
            found your
            <Link
              sx={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
                fontWeight: '500',
              }}
              to={relevantUrl}
              display="inline"
            >
              how-to
            </Link>
            useful
          </Box>
        </Flex>
      ) : (
        <Flex>
          <IconComment
            width="15px"
            height="15px"
            style={{ marginRight: '10px', opacity: '0.6' }}
          />
          <Box style={{ textAlign: 'left' }}>
            New comment on your
            <Link
              sx={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
                fontWeight: '500',
              }}
              to={relevantUrl}
              display="inline"
            >
              how-to
            </Link>
            by
            <Link
              sx={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
                fontWeight: '500',
              }}
              to={'/u/' + triggeredBy.userId}
              display="inline"
            >
              {triggeredBy.displayName}
            </Link>
          </Box>
        </Flex>
      )}
    </Flex>
  )
}
