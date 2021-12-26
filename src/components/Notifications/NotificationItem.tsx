import React from 'react'
import { Box, Image } from 'rebass'

import { Flex } from 'rebass'
import { INotification } from 'src/models'

import { Link } from 'src/components/Links'

import IconComment from 'src/assets/icons/icon-comment.svg'
import IconUseful from 'src/assets/icons/icon-useful.svg'


export interface IProps extends INotification { }


export const NotificationItem: React.FC<IProps> = ({
  _triggeredByUserId,
  triggeredByName,
  howToId,
  type,
  read
}) => {
  return (
    <Flex
      flexDirection="column"
      bg={'white'}
      width="100%"
      style={{ fontSize: '0.9em', width: '340px', padding: '1em 0em 1em 0em', borderBottom: 'groove'}}
    >
        {
          type === "howto_useful" ?
            (
              <Flex>
                <Box
                width={1/5}
                style={{textAlign: 'center'}}
                >
                  <Image src={IconUseful} width="22px" height="22px" />
                </Box>
                <Box
                  width={4/5}
                >
                  Yay,&nbsp;
                  <Link
                    sx={{
                      textDecoration: 'underline',
                      color: 'inherit',
                    }}
                    to={'/u/' + _triggeredByUserId}
                    display="inline"
                  >
                    {triggeredByName}&nbsp;
                  </Link>
                  found your&nbsp;
                  <Link
                    sx={{
                      textDecoration: 'underline',
                      color: 'inherit',
                    }}
                    to={'/how-to/' + howToId}
                    display="inline"
                  >
                    how-to&nbsp;
                  </Link>
                  useful
                </Box>
              </Flex>
            )
            :
            (
              <Flex>
                <Box
                width={1/5}
                style={{textAlign: 'center'}}
                >
                  <Image src={IconComment} width="22px" height="22px" />
                </Box>
                <Box
                  width={4/5}
                >
                  New comment on your&nbsp;
                  <Link
                    sx={{
                      textDecoration: 'underline',
                      color: 'inherit',
                    }}
                    to={'/how-to/' + howToId}
                    display="inline"
                  >
                    how-to&nbsp;
                  </Link>
                  by&nbsp;
                  <Link
                    sx={{
                      textDecoration: 'underline',
                      color: 'inherit',
                    }}
                    to={'/u/' + _triggeredByUserId}
                    display="inline"
                  >
                    {triggeredByName}&nbsp;
                  </Link>
                </Box>
              </Flex>
            )
        }
    </Flex >
  )
};
