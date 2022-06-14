import { Link } from 'react-router-dom'
import { Flex, Box } from 'theme-ui'
import { Icon } from '../Icon/Icon'

export interface Props {
  triggeredBy: {
    displayName: string
    userId: string
  }
  relevantUrl: string
  type: string
}

export const NotificationItem = (props: Props) => {
  const { triggeredBy, relevantUrl, type } = props
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
      {['howto_useful', 'research_useful'].includes(type) ? (
        <Flex style={{ textAlign: 'left', color: 'black' }}>
          <Box sx={{ opacity: 0.6 }}>
            <Icon glyph="useful" size={15} mr={2} />
          </Box>
          <Box>
            Yay,
            <Link
              style={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
              }}
              to={'/u/' + triggeredBy.userId}
            >
              {triggeredBy.displayName}
            </Link>
            found your
            <Link
              style={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
                fontWeight: 500,
                display: 'inline',
              }}
              to={relevantUrl || ''}
            >
              {type === 'howto_useful' ? 'how-to' : 'research'}
            </Link>
            useful
          </Box>
        </Flex>
      ) : (
        <Flex>
          <Box sx={{ opacity: 0.6 }}>
            <Icon glyph="comment" size={15} mr={2} />
          </Box>
          <Box style={{ textAlign: 'left' }}>
            New comment on your
            <Link
              style={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
              }}
              to={relevantUrl || ''}
            >
              {type == 'new_comment_research' ? 'Research' : 'how-to'}
            </Link>
            by
            <Link
              style={{
                textDecoration: 'underline',
                padding: '3px',
                color: '#61646b',
                fontWeight: 500,
                display: 'inline',
              }}
              to={'/u/' + triggeredBy.userId}
            >
              {triggeredBy.displayName}
            </Link>
          </Box>
        </Flex>
      )}
    </Flex>
  )
}
