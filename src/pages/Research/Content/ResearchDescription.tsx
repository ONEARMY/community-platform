import { format } from 'date-fns'
import * as React from 'react'
import { Box, Flex, Image, Text, Heading } from 'theme-ui'
import ArrowIcon from 'src/assets/icons/icon-arrow-select.svg'
import {
  Button,
  FlagIconHowTos,
  LinkifyText,
  ModerationStatus,
  UsefulStatsButton,
} from 'oa-components'
import type { IResearch } from 'src/models/research.models'
import theme from 'src/themes/styled.theme'
import type { IUser } from 'src/models/user.models'
import { VerifiedUserBadge } from 'src/components/VerifiedUserBadge/VerifiedUserBadge'
import { Link } from 'react-router-dom'

interface IProps {
  research: IResearch.ItemDB
  isEditable: boolean
  loggedInUser: IUser | undefined
  needsModeration: boolean
  votedUsefulCount?: number
  hasUserVotedUseful: boolean
  moderateResearch: (accepted: boolean) => void
  onUsefulClick: () => void
}

const ResearchDescription: React.FC<IProps> = ({
  research,
  isEditable,
  ...props
}) => {
  const dateLastUpdateText = (research: IResearch.ItemDB): string => {
    const lastModifiedDate = format(new Date(research._modified), 'DD-MM-YYYY')
    const creationDate = format(new Date(research._created), 'DD-MM-YYYY')
    if (lastModifiedDate !== creationDate) {
      return 'Last update on ' + lastModifiedDate
    } else {
      return ''
    }
  }

  return (
    <Flex
      data-cy="research-basis"
      data-id={research._id}
      sx={{
        position: 'relative',
        borderRadius: theme.radii[2] + 'px',
        bg: 'white',
        borderColor: theme.colors.black,
        borderStyle: 'solid',
        borderWidth: '2px',
        overflow: 'hidden',
        flexDirection: ['column-reverse', 'column-reverse', 'row'],
        mt: 4,
      }}
    >
      <Flex px={4} py={4} sx={{ flexDirection: 'column', width: '100%' }}>
        <Flex sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Link to={'/research'}>
            <Button
              variant="subtle"
              sx={{ fontSize: '14px' }}
              data-cy="go-back"
            >
              <Flex>
                <Image
                  loading="lazy"
                  sx={{
                    width: '10px',
                    marginRight: '4px',
                    transform: 'rotate(90deg)',
                  }}
                  src={ArrowIcon}
                />
                <Text>Back</Text>
              </Flex>
            </Button>
          </Link>
          {props.votedUsefulCount !== undefined && (
            <Box style={{ flexGrow: 1 }}>
              <UsefulStatsButton
                votedUsefulCount={props.votedUsefulCount}
                hasUserVotedUseful={props.hasUserVotedUseful}
                isLoggedIn={props.loggedInUser ? true : false}
                onUsefulClick={props.onUsefulClick}
              />
            </Box>
          )}
          {/* Check if research should be moderated */}
          {props.needsModeration && (
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Button
                data-cy={'accept'}
                variant={'primary'}
                icon="check"
                mr={1}
                onClick={() => props.moderateResearch(true)}
              />
              <Button
                data-cy="reject-research"
                variant={'tertiary'}
                icon="delete"
                onClick={() => props.moderateResearch(false)}
              />
            </Flex>
          )}
          {/* Show edit button for the creator of the research OR a super-admin */}
          {isEditable && (
            <Link to={'/research/' + research.slug + '/edit'}>
              <Button variant={'primary'} data-cy={'edit'}>
                Edit
              </Button>
            </Link>
          )}
        </Flex>
        <Box mt={3} mb={2}>
          <Flex sx={{ alignItems: 'center' }}>
            {research.creatorCountry && (
              <FlagIconHowTos code={research.creatorCountry} />
            )}
            <Text
              ml={1}
              sx={{
                ...theme.typography.auxiliary,
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              <Flex sx={{ alignItems: 'center' }}>
                By
                <Link to={'/u/' + research._createdBy}>
                  <Text
                    ml={1}
                    mr={1}
                    sx={{
                      textDecoration: 'underline',
                      color: 'black',
                    }}
                  >
                    {research._createdBy}
                  </Text>
                </Link>
                <VerifiedUserBadge
                  userId={research._createdBy}
                  mr={1}
                  width="12px"
                  height="12px"
                />
                | Started on {format(new Date(research._created), 'DD-MM-YYYY')}
              </Flex>
            </Text>
          </Flex>
          <Text
            sx={{
              ...theme.typography.auxiliary,
              color: `${theme.colors.lightgrey} !important`,
            }}
            mt={1}
            mb={2}
          >
            {dateLastUpdateText(research)}
          </Text>
          <Heading mt={2} mb={1}>
            {research.title}
          </Heading>
          <Text sx={{ whiteSpace: 'pre-line', ...theme.typography.paragraph }}>
            <LinkifyText>{research.description}</LinkifyText>
          </Text>
        </Box>
      </Flex>
      {research.moderation !== 'accepted' && (
        <ModerationStatus
          status={research.moderation}
          contentType="research"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}
        />
      )}
    </Flex>
  )
}

export default ResearchDescription
