import React, { useState } from 'react'
import { Box } from 'rebass'
import styled from 'styled-components'

import { FaTrash, FaRegEdit } from 'react-icons/fa'
import { Flex } from 'rebass'
import { useCommonStores } from 'src'
import { IComment, INotification } from 'src/models'
import theme, { zIndex } from 'src/themes/styled.theme'

import { Text } from 'src/components/Text'
import { Field, Form } from 'react-final-form'
import { Button } from 'src/components/Button'

import { Link } from 'src/components/Links'


export interface IProps extends INotification { }

const ModalItem = styled(Box)`
  z-index: ${zIndex.modalProfile};
  display: flex;
  flex-direction: column;
  color: #000;
  padding: 10px 30px 10px 30px;
  text-align: left;
  width: 100%;
  max-width: 100%;
  max-height: 100%;
  }
`

export const NotificationItem: React.FC<IProps> = ({
  _id,
  _created,
  _triggeredByUserId,
  triggeredByName,
  commentId,
  howToId,
  type,
  read,
  ...props
}) => {
  return (
    <Flex
      flexDirection="column"
      p="3"
      bg={'white'}
      width="100%"
      mb={4}
      style={{ borderRadius: '5px' }}
    >
      <Flex>
        {
          type === "howto_useful" ?
            (
              <ModalItem>
                Yay,
                <Link
                  sx={{
                    textDecoration: 'underline',
                    color: 'inherit',
                  }}
                  to={'/u/' + triggeredByName}
                >
                  {triggeredByName}
                </Link>
                found your
                
                useful

              </ModalItem>
            )
            :
            <div></div>
        }
      </Flex>

    </Flex >
  )
};
