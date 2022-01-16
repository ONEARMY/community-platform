import React from 'react'
import { Box } from 'rebass'
import { Flex } from 'rebass'
import { INotification } from 'src/models'
import { Link } from 'src/components/Links'
import { ReactComponent as IconComment } from 'src/assets/icons/icon-comment.svg'
import { ReactComponent as IconUseful } from 'src/assets/icons/icon-useful.svg'



export interface IProps extends INotification { }

export const NotificationItem: React.FC<IProps> = ({
  _triggeredByUserId,
  triggeredByName,
  howToId,
  type
}) => {
  return (
    <Flex
      flexDirection="column"
      bg={'white'}
      width="100%"
      style={{
        fontSize: '12px', marginBottom: '10px',
        paddingBottom: '10px', borderBottom: '1px solid #c7c7c7',
        fontFamily: "Inter, sans-serif"
      }}
    >
      {
        type === "howto_useful" ?
          (
            <Flex style={{ textAlign: 'left', color: 'black' }}>
              <IconUseful width="15px" height="15px" style={{ marginRight: "10px", opacity: "0.6" }} />
              <Box
              >
                Yay,
                  <Link
                  style={{
                    textDecoration: 'underline',
                    padding: '3px',
                    color: '#61646b',
                    fontWeight: '500'
                  }}
                  to={'/u/' + _triggeredByUserId}
                  display="inline"
                >
                  {triggeredByName}
                </Link>
                  found your
                  <Link
                  sx={{
                    textDecoration: 'underline',
                    padding: '3px',
                    color: '#61646b',
                    fontWeight: '500'
                  }}
                  to={'/how-to/' + howToId}
                  display="inline"
                >
                  how-to
                  </Link>
                  useful
                </Box>
            </Flex>
          )
          :
          (
            <Flex>
              <IconComment width="15px" height="15px" style={{ marginRight: "10px", opacity: "0.6" }} />
              <Box
                style={{ textAlign: 'left' }}
              >
                New comment on your
                  <Link
                  sx={{
                    textDecoration: 'underline',
                    padding: '3px',
                    color: '#61646b',
                    fontWeight: '500'
                  }}
                  to={'/how-to/' + howToId}
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
                    fontWeight: '500'
                  }}
                  to={'/u/' + _triggeredByUserId}
                  display="inline"
                >
                  {triggeredByName}
                </Link>
              </Box>
            </Flex>
          )
      }
    </Flex >
  )
};
