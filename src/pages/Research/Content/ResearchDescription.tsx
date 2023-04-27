import { format } from 'date-fns'
import {
  Button,
  LinkifyText,
  ModerationStatus,
  UsefulStatsButton,
  Username,
  ViewsCounter,
  DownloadFiles,
  FileInformation,
} from 'oa-components'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { isUserVerified } from 'src/common/isUserVerified'
import type { IResearch } from 'src/models/research.models'
import type { IUser } from 'src/models/user.models'
import { useResearchStore } from 'src/stores/Research/research.store'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import {
  addIDToSessionStorageArray,
  retrieveSessionStorageArray,
} from 'src/utils/sessionStorage'
import { Box, Flex, Heading, Text } from 'theme-ui'
import {
  retrieveResearchDownloadCooldown,
  isResearchDownloadCooldownExpired,
  addResearchDownloadCooldown,
  updateResearchDownloadCooldown,
} from './downloadCooldown'

interface IProps {
  research: IResearch.ItemDB
  isEditable: boolean
  loggedInUser: IUser | undefined
  needsModeration: boolean
  votedUsefulCount?: number
  hasUserVotedUseful: boolean
  moderateResearch: (accepted: boolean) => void
  onUsefulClick: () => void
  onFollowingClick: () => void
}

const ResearchDescription = ({ research, isEditable, ...props }: IProps) => {
  const dateLastUpdateText = (research: IResearch.ItemDB): string => {
    const lastModifiedDate = format(new Date(research._modified), 'DD-MM-YYYY')
    const creationDate = format(new Date(research._created), 'DD-MM-YYYY')
    if (lastModifiedDate !== creationDate) {
      return 'Last update on ' + lastModifiedDate
    } else {
      return ''
    }
  }
  let didInit = false
  const store = useResearchStore()
  const [viewCount, setViewCount] = useState<number | undefined>()
  const [fileDownloadCount, setFileDownloadCount] = useState(
    research.attachments?.total_downloads,
  )

  const incrementDownloadCount = async () => {
    const updatedDownloadCount = await store.incrementDownloadCount(
      research._id,
    )
    setFileDownloadCount(updatedDownloadCount!)
  }

  const incrementViewCount = async () => {
    const sessionStorageArray = retrieveSessionStorageArray('research')

    if (!sessionStorageArray.includes(research._id)) {
      const updatedViewCount = await store.incrementViewCount(research._id)
      setViewCount(updatedViewCount)
      addIDToSessionStorageArray('research', research._id)
    } else {
      setViewCount(research.total_views)
    }
  }

  const handleClick = async () => {
    const researchDownloadCooldown = retrieveResearchDownloadCooldown(
      research._id,
    )

    if (
      researchDownloadCooldown &&
      isResearchDownloadCooldownExpired(researchDownloadCooldown)
    ) {
      updateResearchDownloadCooldown(research._id)
      incrementDownloadCount()
    } else if (!researchDownloadCooldown) {
      addResearchDownloadCooldown(research._id)
      incrementDownloadCount()
    }
  }

  useEffect(() => {
    if (!didInit) {
      didInit = true
      incrementViewCount()
    }
  }, [research._id])

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
        <Flex sx={{ flexWrap: 'wrap', gap: '10px' }}>
          <Link to={'/research'}>
            <Button
              variant="subtle"
              sx={{ fontSize: '14px' }}
              data-cy="go-back"
              icon="arrow-back"
            >
              Back
            </Button>
          </Link>
          {props.votedUsefulCount !== undefined && (
            <Box>
              <UsefulStatsButton
                votedUsefulCount={props.votedUsefulCount}
                hasUserVotedUseful={props.hasUserVotedUseful}
                isLoggedIn={props.loggedInUser ? true : false}
                onUsefulClick={props.onUsefulClick}
              />
            </Box>
          )}
          <AuthWrapper roleRequired="beta-tester">
            <Button
              icon="thunderbolt"
              variant="outline"
              sx={{
                fontSize: 2,
                py: 0,
                height: '41.5px', // TODO: Ideally this is a standard size
              }}
              onClick={() => {
                props.onFollowingClick()
              }}
            >
              {research.subscribers?.includes(
                props?.loggedInUser?.userName || '',
              )
                ? 'Following'
                : 'Follow'}
            </Button>
          </AuthWrapper>
          {viewCount ? (
            <AuthWrapper roleRequired="beta-tester">
              <Box>
                <ViewsCounter viewsCount={viewCount!} />
              </Box>
            </AuthWrapper>
          ) : null}
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
                variant={'outline'}
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
            <Flex sx={{ alignItems: 'center' }}>
              <Username
                user={{
                  userName: research._createdBy,
                  countryCode: research.creatorCountry,
                }}
                isVerified={isUserVerified(research._createdBy)}
              />
              <Text
                sx={{
                  ...theme.typography.auxiliary,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              >
                Started on {format(new Date(research._created), 'DD-MM-YYYY')}
              </Text>
            </Flex>
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
          {((research.files && research.files.length > 0) ||
            research.fileLink) && (
            <Flex
              className="file-container"
              mt={3}
              sx={{ flexDirection: 'column' }}
            >
              {research.fileLink && (
                <DownloadFiles
                  handleClick={handleClick}
                  link={research.fileLink}
                />
              )}
              {research.files &&
                research.files
                  .filter(Boolean)
                  .map(
                    (file, index) =>
                      file && (
                        <FileInformation
                          allowDownload
                          file={file}
                          key={file ? file.name : `file-${index}`}
                          handleClick={handleClick}
                        />
                      ),
                  )}
              {typeof fileDownloadCount === 'number' && (
                <Text
                  data-cy="file-download-counter"
                  sx={{
                    fontSize: '12px',
                    color: '#61646B',
                    paddingLeft: '8px',
                  }}
                >
                  {fileDownloadCount}
                  {fileDownloadCount !== 1 ? ' downloads' : ' download'}
                </Text>
              )}
            </Flex>
          )}
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
