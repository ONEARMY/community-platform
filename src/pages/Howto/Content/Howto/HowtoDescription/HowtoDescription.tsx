import { PureComponent } from 'react'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import { format } from 'date-fns'
import type { IHowtoDB } from 'src/models/howto.models'
import { Heading, Text, Box, Flex, Image } from 'theme-ui'
import { ModerationStatusText } from 'src/components/ModerationStatusText/ModerationStatustext'
import { FileInfo } from 'src/components/FileInfo/FileInfo'
import StepsIcon from 'src/assets/icons/icon-steps.svg'
import TimeNeeded from 'src/assets/icons/icon-time-needed.svg'
import DifficultyLevel from 'src/assets/icons/icon-difficulty-level.svg'
import { Button, FlagIconHowTos } from 'oa-components'
import type { IUser } from 'src/models/user.models'
import {
  isAllowToEditContent,
  emStringToPx,
  capitalizeFirstLetter,
} from 'src/utils/helpers'
import theme from 'src/themes/styled.theme'
import ArrowIcon from 'src/assets/icons/icon-arrow-select.svg'
import { VerifiedUserBadge } from 'src/components/VerifiedUserBadge/VerifiedUserBadge'
import { UsefulStatsButton } from 'src/components/UsefulStatsButton/UsefulStatsButton'
import { DownloadExternal } from 'src/pages/Howto/DownloadExternal/DownloadExternal'
import Linkify from 'react-linkify'
import { Link } from 'react-router-dom'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import { inject, observer } from 'mobx-react'
import {
  retrieveHowtoDownloadCooldown,
  isHowtoDownloadCooldownExpired,
  addHowtoDownloadCooldown,
  updateHowtoDownloadCooldown,
} from './downloadCooldown'

interface IProps {
  howto: IHowtoDB
  loggedInUser: IUser | undefined
  needsModeration: boolean
  votedUsefulCount?: number
  verified?: boolean
  hasUserVotedUseful: boolean
  moderateHowto: (accepted: boolean) => void
  onUsefulClick: () => void
}

interface IInjected extends IProps {
  howtoStore: HowtoStore
}

interface IState {
  fileDownloadCount: number | undefined
}

@inject('howtoStore')
@observer
export default class HowtoDescription extends PureComponent<IProps, IState> {
  // eslint-disable-next-line
  constructor(props: IProps) {
    super(props)
    this.state = {
      fileDownloadCount: this.props.howto.total_downloads || 0,
    }
    this.handleClick = this.handleClick.bind(this)
  }

  get injected() {
    return this.props as IInjected
  }

  private setFileDownloadCount = (val: number) => {
    this.setState({
      fileDownloadCount: val,
    })
  }

  private dateCreatedByText(howto: IHowtoDB): string {
    return format(new Date(howto._created), 'DD-MM-YYYY')
  }

  private dateLastEditText(howto: IHowtoDB): string {
    const lastModifiedDate = format(new Date(howto._modified), 'DD-MM-YYYY')
    const creationDate = format(new Date(howto._created), 'DD-MM-YYYY')
    if (lastModifiedDate !== creationDate) {
      return 'Last edit on ' + format(new Date(howto._modified), 'DD-MM-YYYY')
    } else {
      return ''
    }
  }

  private incrementDownloadCount = async () => {
    const updatedDownloadCount =
      await this.injected.howtoStore.incrementDownloadCount(
        this.props.howto._id,
      )
    this.setFileDownloadCount(updatedDownloadCount!)
  }

  private handleClick = async () => {
    const howtoDownloadCooldown = retrieveHowtoDownloadCooldown(
      this.props.howto._id,
    )

    if (
      howtoDownloadCooldown &&
      isHowtoDownloadCooldownExpired(howtoDownloadCooldown)
    ) {
      updateHowtoDownloadCooldown(this.props.howto._id)
      this.incrementDownloadCount()
    } else if (!howtoDownloadCooldown) {
      addHowtoDownloadCooldown(this.props.howto._id)
      this.incrementDownloadCount()
    }
  }

  public render() {
    const { howto, loggedInUser } = this.props

    const iconFlexDirection =
      emStringToPx(theme.breakpoints[0]) > window.innerWidth ? 'column' : 'row'
    return (
      <Flex
        data-cy="how-to-basis"
        data-id={howto._id}
        className="howto-description-container"
        sx={{
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
        <Flex
          px={4}
          py={4}
          sx={{
            flexDirection: 'column',
            width: ['100%', '100%', `${(1 / 2) * 100}%`],
          }}
        >
          <Flex sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Link to={'/how-to/'}>
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
            {this.props.votedUsefulCount !== undefined && (
              <Box style={{ flexGrow: 1 }}>
                <UsefulStatsButton
                  votedUsefulCount={this.props.votedUsefulCount}
                  hasUserVotedUseful={this.props.hasUserVotedUseful}
                  isLoggedIn={this.props.loggedInUser ? true : false}
                  onUsefulClick={this.props.onUsefulClick}
                />
              </Box>
            )}
            {/* Check if pin should be moderated */}
            {this.props.needsModeration && (
              <Flex sx={{ justifyContent: 'space-between' }}>
                <Button
                  data-cy={'accept'}
                  variant={'primary'}
                  icon="check"
                  mr={1}
                  onClick={() => this.props.moderateHowto(true)}
                />
                <Button
                  data-cy="reject-howto"
                  variant={'tertiary'}
                  icon="delete"
                  onClick={() => this.props.moderateHowto(false)}
                />
              </Flex>
            )}
            {/* Check if logged in user is the creator of the how-to OR a super-admin */}
            {loggedInUser && isAllowToEditContent(howto, loggedInUser) && (
              <Link to={'/how-to/' + this.props.howto.slug + '/edit'}>
                <Button variant={'primary'} data-cy={'edit'}>
                  Edit
                </Button>
              </Link>
            )}
          </Flex>
          <Box mt={3} mb={2}>
            <Flex sx={{ alignItems: 'center' }}>
              {howto.creatorCountry && (
                <FlagIconHowTos code={howto.creatorCountry} />
              )}
              <Text
                my={2}
                ml={1}
                sx={{ ...theme.typography.auxiliary, display: 'inline-block' }}
              >
                By{' '}
                <Link
                  style={{
                    textDecoration: 'underline',
                    color: 'inherit',
                  }}
                  to={'/u/' + howto._createdBy}
                >
                  {howto._createdBy}
                </Link>{' '}
                <VerifiedUserBadge
                  userId={howto._createdBy}
                  height="12px"
                  width="12px"
                />
                | Published on {this.dateCreatedByText(howto)}
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
              {this.dateLastEditText(howto)}
            </Text>
            <Heading mt={2} mb={1}>
              {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
              {capitalizeFirstLetter(howto.title)}
            </Heading>
            <Text
              sx={{ ...theme.typography.paragraph, whiteSpace: 'pre-line' }}
            >
              <Linkify properties={{ target: '_blank' }}>
                {howto.description}
              </Linkify>
            </Text>
          </Box>

          <Flex mt="4">
            <Flex mr="4" sx={{ flexDirection: iconFlexDirection }}>
              <Image
                loading="lazy"
                src={StepsIcon}
                height="16"
                width="23"
                mr="2"
                mb="2"
              />
              {howto.steps.length} steps
            </Flex>
            <Flex mr="4" sx={{ flexDirection: iconFlexDirection }}>
              <Image
                loading="lazy"
                src={TimeNeeded}
                height="16"
                width="16"
                mr="2"
                mb="2"
              />
              {howto.time}
            </Flex>
            <Flex mr="4" sx={{ flexDirection: iconFlexDirection }}>
              <Image
                loading="lazy"
                src={DifficultyLevel}
                height="15"
                width="16"
                mr="2"
                mb="2"
              />
              {howto.difficulty_level}
            </Flex>
          </Flex>
          <Flex mt={4}>
            {howto.tags &&
              Object.keys(howto.tags).map((tag) => {
                return <TagDisplay key={tag} tagKey={tag} />
              })}
          </Flex>
          {((howto.files && howto.files.length > 0) || howto.fileLink) && (
            <Flex
              className="file-container"
              mt={3}
              sx={{ flexDirection: 'column' }}
            >
              {howto.fileLink && (
                <DownloadExternal
                  handleClick={this.handleClick}
                  link={howto.fileLink}
                />
              )}
              {howto.files.map((file, index) => (
                <FileInfo
                  allowDownload
                  file={file}
                  key={file ? file.name : `file-${index}`}
                  handleClick={this.handleClick}
                />
              ))}
              {typeof this.state.fileDownloadCount === 'number' && (
                <Text
                  sx={{
                    fontSize: '12px',
                    color: '#61646B',
                    paddingLeft: '8px',
                  }}
                >
                  {this.state.fileDownloadCount}
                  {this.state.fileDownloadCount !== 1
                    ? ' downloads'
                    : ' download'}
                </Text>
              )}
            </Flex>
          )}
        </Flex>
        <Flex
          sx={{
            width: ['100%', '100%', `${(1 / 2) * 100}%`],
            position: 'relative',
            justifyContent: 'end',
          }}
        >
          <Image
            loading="lazy"
            sx={{
              objectFit: 'cover',
              width: 'auto',
              height: '100%',
            }}
            src={howto.cover_image.downloadUrl}
            crossOrigin=""
            alt="how-to cover"
          />
          {howto.moderation !== 'accepted' && (
            <ModerationStatusText
              moderatedContent={howto}
              contentType="howto"
              top={'0px'}
            />
          )}
        </Flex>
      </Flex>
    )
  }
}
