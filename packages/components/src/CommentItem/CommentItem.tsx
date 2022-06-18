import { createRef, useEffect, useState } from 'react'
import Linkify from 'react-linkify'
import { Link } from 'react-router-dom'
import { Button, EditComment, Modal } from '../index'
import { Box, Flex, Text } from 'theme-ui'
import { FlagIconHowTos } from '../FlagIcon/FlagIcon'
import { Icon } from '../Icon/Icon'
import { TextWithMentions } from './../TextWithMetnions/TextWithMentions'

export interface Props {
  text: string
  isUserVerified: boolean
  isEditable: boolean
  creatorCountry?: string | null
  creatorName: string
  _id: string
  _edited?: string
  _created?: string
  handleEdit?: (commentId: string, newCommentText: string) => void
  handleDelete?: (commentId: string) => Promise<void>
  handleEditRequest?: (commentId: string) => Promise<void>
}

const formatDate = (d: string | undefined): string => {
  if (!d) {
    return ''
  }
  return new Date(d).toLocaleDateString('en-GB').replace(/\//g, '-')
}

export const CommentItem = (props: Props) => {
  const textRef = createRef<any>()
  const [showEditModal, setShowEditModal] = useState(false)
  const [textHeight, setTextHeight] = useState(0)
  const [isShowMore, setShowMore] = useState(false)
  const {
    creatorCountry,
    creatorName,
    isUserVerified,
    _id,
    _edited,
    _created,
    text,
    handleEditRequest,
    handleDelete,
    handleEdit,
    isEditable,
  } = props

  useEffect(() => {
    if (textRef.current) {
      setTextHeight(textRef.current.scrollHeight)
    }
  }, [text])

  const showMore = () => {
    setShowMore(!isShowMore)
  }

  return (
    <Box data-cy="comment" id={'comment_' + _id}>
      <Flex
        p="3"
        bg={'white'}
        mb={4}
        sx={{
          width: '100%',
          flexDirection: 'column',
          borderRadius: '5px',
        }}
      >
        <Flex sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Box>
            {creatorCountry && <FlagIconHowTos code={creatorCountry} />}
            <span style={{ marginLeft: creatorCountry ? '5px' : 0 }}>
              <Link
                style={{
                  textDecoration: 'underline',
                  color: 'inherit',
                  display: 'inline-block',
                  marginRight: '5px',
                }}
                to={'/u/' + creatorName}
              >
                {creatorName}
              </Link>
              {isUserVerified && <Icon glyph="verified" size={12} />}
            </span>
          </Box>
          <Flex sx={{ alignItems: 'center' }}>
            <>
              {_edited && (
                <Text sx={{ fontSize: 0, color: 'grey' }} mr={2}>
                  (Edited)
                </Text>
              )}
              <Text sx={{ fontSize: 1 }}>
                {formatDate(_edited || _created)}
              </Text>
            </>
          </Flex>
        </Flex>
        <Text
          data-cy="comment-text"
          mt={2}
          mb={2}
          sx={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflow: 'hidden',
            lineHeight: '1em',
            maxHeight: isShowMore ? 'max-content' : '128px',
          }}
          ref={textRef}
        >
          <Linkify properties={{ target: '_blank' }}>
            <TextWithMentions text={text} />
          </Linkify>
        </Text>
        {textHeight > 129 && (
          <a
            onClick={showMore}
            style={{
              color: 'gray',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {isShowMore ? 'Show less' : 'Show more'}
          </a>
        )}
        <Flex ml="auto">
          {isEditable && (
            <>
              <Button
                variant={'outline'}
                small={true}
                icon={'edit'}
                onClick={() => handleEditRequest}
              >
                edit
              </Button>
              <Button
                variant={'outline'}
                small={true}
                icon="delete"
                onClick={() => handleDelete && handleDelete(_id)}
                ml={2}
              >
                delete
              </Button>
            </>
          )}
        </Flex>

        <Modal width={600} isOpen={showEditModal}>
          <EditComment
            comment={text}
            handleSubmit={(commentText) => {
              handleEdit && handleEdit(_id, commentText)
              setShowEditModal(false)
            }}
            handleCancel={() => setShowEditModal(false)}
          />
        </Modal>
      </Flex>
    </Box>
  )
}
