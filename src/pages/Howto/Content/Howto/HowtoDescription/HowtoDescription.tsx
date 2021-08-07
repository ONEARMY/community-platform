import { PureComponent } from 'react'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import { format } from 'date-fns'
import { IHowtoDB } from 'src/models/howto.models'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import ModerationStatusText from 'src/components/ModerationStatusText'
import { Link } from 'src/components/Links'
import { Box, Flex, Image } from 'rebass'
import { FileInfo } from 'src/components/FileInfo/FileInfo'
import StepsIcon from 'src/assets/icons/icon-steps.svg'
import TimeNeeded from 'src/assets/icons/icon-time-needed.svg'
import DifficultyLevel from 'src/assets/icons/icon-difficulty-level.svg'
import { Button } from 'src/components/Button'
import { IUser } from 'src/models/user.models'
import {
  isAllowToEditContent,
  emStringToPx,
  capitalizeFirstLetter,
} from 'src/utils/helpers'
import theme from 'src/themes/styled.theme'
import ArrowIcon from 'src/assets/icons/icon-arrow-select.svg'
import { FlagIconHowTos } from 'src/components/Icons/FlagIcon/FlagIcon'
import { HowtoUsefulStats } from './HowtoUsefulStats'

interface IProps {
  howto: IHowtoDB
  loggedInUser: IUser | undefined
  needsModeration: boolean
  votedUsefulCount?: number
  userVotedUseful: boolean
  moderateHowto: (accepted: boolean) => void
  onUsefulClick: () => void
}

export default class HowtoDescription extends PureComponent<IProps> {
  // eslint-disable-next-line
  constructor(props: IProps) {
    super(props)
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
        <Flex px={4} py={4} flexDirection={'column'} width={[1, 1, 1 / 2]}>
          <Flex justifyContent="space-between" flexWrap="wrap">
            <Link to={'/how-to/'}>
              <Button variant="subtle" fontSize="14px" data-cy="go-back">
                <Flex>
                  <Image
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
            <Box style={{ flexGrow: 1 }}>
              {this.props.votedUsefulCount !== undefined && (
                <HowtoUsefulStats
                  votedUsefulCount={this.props.votedUsefulCount}
                  userVotedUseful={this.props.userVotedUseful}
                  isLoggedIn={this.props.loggedInUser ? true : false}
                  onUsefulClick={this.props.onUsefulClick}
                />
              )}
            </Box>
            {/* Check if pin should be moderated */}
            {this.props.needsModeration && (
              <Flex justifyContent={'space-between'}>
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
            <Flex alignItems="center">
              {howto.creatorCountry && (
                <FlagIconHowTos code={howto.creatorCountry} />
              )}
              <Text inline auxiliary my={2} ml={1}>
                By{' '}
                <Link
                  sx={{
                    textDecoration: 'underline',
                    color: 'inherit',
                  }}
                  to={'/u/' + howto._createdBy}
                >
                  {howto._createdBy}
                </Link>{' '}
                | Published on {this.dateCreatedByText(howto)}
              </Text>
            </Flex>
            <Text auxiliary sx={{ color: '#b7b5b5 !important' }} mt={1} mb={2}>
              {this.dateLastEditText(howto)}
            </Text>
            <Heading medium mt={2} mb={1}>
              {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
              {capitalizeFirstLetter(howto.title)}
            </Heading>
            <Text preLine paragraph>
              {howto.description}
            </Text>
          </Box>

          <Flex mt="4">
            <Flex mr="4" flexDirection={iconFlexDirection}>
              <Image src={StepsIcon} height="1em" mr="2" mb="2" />
              {howto.steps.length} steps
            </Flex>
            <Flex mr="4" flexDirection={iconFlexDirection}>
              <Image src={TimeNeeded} height="1em" mr="2" mb="2" />
              {howto.time}
            </Flex>
            <Flex mr="4" flexDirection={iconFlexDirection}>
              <Image src={DifficultyLevel} height="1em" mr="2" mb="2" />
              {howto.difficulty_level}
            </Flex>
          </Flex>
          <Flex mt={4}>
            {howto.tags &&
              Object.keys(howto.tags).map(tag => {
                return <TagDisplay key={tag} tagKey={tag} />
              })}
          </Flex>
          {howto.files && howto.files.length > 0 && (
            <Flex className="file-container" mt={3} flexDirection={'column'}>
              {howto.files.map((file, index) => (
                <FileInfo
                  allowDownload
                  file={file}
                  key={file ? file.name : `file-${index}`}
                />
              ))}
            </Flex>
          )}
        </Flex>
        <Flex
          justifyContent={'end'}
          width={[1, 1, 1 / 2]}
          sx={{ position: 'relative' }}
        >
          <Image
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
