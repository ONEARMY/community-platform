import React from 'react'
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
import { isAllowToEditContent } from 'src/utils/helpers'
import theme from 'src/themes/styled.theme'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'

interface IProps {
  howto: IHowtoDB
  loggedInUser: IUser | undefined
  needsModeration: boolean
  moderateHowto: (accepted: boolean) => void
}

export default class HowtoDescription extends React.PureComponent<IProps, any> {
  constructor(props: IProps) {
    super(props)
  }

  private createdByText(howto: IHowtoDB): string {
    return (
      'By ' +
      howto._createdBy +
      ' ' +
      format(new Date(howto._created), 'DD-MM-YYYY')
    )
  }

  private lastEditText(howto: IHowtoDB): string {
    return 'Last edit: ' + format(new Date(howto._modified), 'DD-MM-YYYY')
  }

  public render() {
    const { howto, loggedInUser } = this.props

    return (
      <Flex
        data-cy="how-to-basis"
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
          <Flex justifyContent={'space-between'}>
            <Link to={'/how-to/'}>
              <Button variant={'secondary'} data-cy={'go-back'}>
                Back
              </Button>
            </Link>
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
            {loggedInUser &&
              (isAllowToEditContent(howto, loggedInUser) && (
                <Link to={'/how-to/' + this.props.howto.slug + '/edit'}>
                  <Button variant={'primary'} data-cy={'edit'}>
                    Edit
                  </Button>
                </Link>
              ))}
          </Flex>
          <Text small mt={4}>
            {this.createdByText(howto)}
          </Text>
          <Text auxiliary mt={1} mb={2}>
            {this.lastEditText(howto)}
          </Text>
          <Heading medium mt={2} mb={1}>
            {howto.title}
          </Heading>
          <Text preLine paragraph>
            {howto.description}
          </Text>

          <Flex mt={4} mb={2}>
            <ElWithBeforeIcon IconUrl={StepsIcon} height="15px">
              {howto.steps.length} steps
            </ElWithBeforeIcon>
            <ElWithBeforeIcon IconUrl={TimeNeeded}>
              {howto.time}
            </ElWithBeforeIcon>
            <ElWithBeforeIcon IconUrl={DifficultyLevel}>
              {howto.difficulty_level}
            </ElWithBeforeIcon>
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
            sx={{ objectFit: 'cover', width: '100%', height: '450px' }}
            src={howto.cover_image.downloadUrl}
            alt="how-to cover"
          />
          {howto.moderation !== 'accepted' && (
            <ModerationStatusText howto={howto} top={'0px'} />
          )}
        </Flex>
      </Flex>
    )
  }
}
