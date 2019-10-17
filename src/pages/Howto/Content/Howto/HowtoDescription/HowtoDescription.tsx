import React from 'react'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import differenceInDays from 'date-fns/difference_in_days'
import { IHowtoDB } from 'src/models/howto.models'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
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
}

export default class HowtoDescription extends React.PureComponent<IProps, any> {
  constructor(props: IProps) {
    super(props)
  }

  public durationSincePosted(postDate: Date) {
    const daysSince: number = differenceInDays(new Date(), new Date(postDate))
    return `${daysSince} days ago`
  }

  public render() {
    const { howto, loggedInUser } = this.props

    return (
      <Flex
        data-cy={'how-to-basis'}
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
              <Button variant={'secondary'} data-cy={'go-back'}>Back</Button>
            </Link>
            {/* Check if logged in user is the creator of the how-to OR a super-admin */}
            {loggedInUser &&
              (isAllowToEditContent(howto, loggedInUser) && (
                <Link to={'/how-to/' + this.props.howto.slug + '/edit'}>
                  <Button variant={'primary'} data-cy={'edit'}>Edit</Button>
                </Link>
              ))}
          </Flex>
          <Text capitalize auxiliary mt={3} mb={2}>
            By {howto._createdBy}
            &nbsp;|&nbsp;
            <Text inline color={'grey'}>
              {this.durationSincePosted(new Date(howto._created))}
            </Text>
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
          {howto.files && (
            <Flex mt={3} flexDirection={'column'}>
              {howto.files.map(file => (
                <FileInfo allowDownload file={file} key={file.name} />
              ))}
            </Flex>
          )}
        </Flex>
        <Flex justifyContent={'end'} width={[1, 1, 1 / 2]}>
          <Image
            sx={{ objectFit: 'cover', width: '100%', height: '450px' }}
            src={howto.cover_image.downloadUrl}
            alt="how-to cover"
          />
        </Flex>
      </Flex>
    )
  }
}
