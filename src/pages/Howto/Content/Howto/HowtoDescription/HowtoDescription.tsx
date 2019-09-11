import React from 'react'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import differenceInDays from 'date-fns/difference_in_days'
import { IHowto } from 'src/models/howto.models'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Link } from 'src/components/Links'
import { Box, Flex, Image } from 'rebass'
import Icon from 'src/components/Icons'
import styled from 'styled-components'
import { FileInfo } from 'src/components/FileInfo/FileInfo'
import { background } from 'styled-system'
import ArrowLeft from 'src/assets/icons/icon-arrow.svg'
import Steps from 'src/assets/icons/icon-steps.svg'
import TimeNeeded from 'src/assets/icons/icon-time-needed.svg'
import DifficultyLevel from 'src/assets/icons/icon-difficulty-level.svg'
import { Button } from 'src/components/Button'

interface IProps {
  howto: IHowto
  loggedInUserName: string | undefined
}

export const CoverImg = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 450px;
`

const HowToCard = styled(Flex)`
  border-radius: 10px;
  border: 2px solid black;
  overflow: hidden;
`

const BreadcrumbBox = styled(Box)`
  padding: 6px 10px;
  border-radius: 5px;
  background-color: #e2edf7;
  color: #61646b;
  display: inline-block;
  font-size: 13px;
`

const BreadcrumbLink = styled(Link)`
  color: #61646b;
  padding-left: 10px;
  position: relative;

  &:before {
    content: '';
    background-image: url(${ArrowLeft});
    width: 5px;
    height: 8px;
    background-repeat: no-repeat;
    position: absolute;
    left: 0px;
    bottom: 4px;
  }
`

const StepsBox = styled(Box)`
  padding-left: 30px;
  position: relative;
  font-size: 12px;

  &:before {
    content: '';
    background-image: url(${Steps});
    width: 22px;
    height: 15px;
    background-repeat: no-repeat;
    position: absolute;
    left: 0px;
    bottom: 50%;
    transform: translateY(50%);
  }
`

const TimeNeededBox = styled(Box)`
  padding-left: 30px;
  position: relative;
  font-size: 12px;

  &:before {
    content: '';
    background-image: url(${TimeNeeded});
    width: 22px;
    height: 22px;
    background-repeat: no-repeat;
    position: absolute;
    left: 0px;
    bottom: 50%;
    transform: translateY(50%);
  }
`

const DifficultyLevelBox = styled(Box)`
  padding-left: 25px;
  position: relative;
  font-size: 12px;

  &:before {
    content: '';
    background-image: url(${DifficultyLevel});
    width: 22px;
    height: 22px;
    background-repeat: no-repeat;
    position: absolute;
    left: 0px;
    bottom: 50%;
    transform: translateY(50%);
  }
`

export default class HowtoDescription extends React.PureComponent<IProps, any> {
  constructor(props: IProps) {
    super(props)
  }

  public durationSincePosted(postDate: Date) {
    const daysSince: number = differenceInDays(new Date(), new Date(postDate))
    return `${daysSince} days ago`
  }

  public render() {
    const { howto, loggedInUserName } = this.props

    return (
      <HowToCard
        bg={'white'}
        flexDirection={['column-reverse', 'column-reverse', 'row']}
        mt={4}
      >
        <Flex px={4} py={4} flexDirection={'column'} width={[1, 1, 1 / 2]}>
          <Flex justifyContent={'space-between'}>
            <BreadcrumbBox>
              <BreadcrumbLink to={'/how-to'}>Back</BreadcrumbLink>
            </BreadcrumbBox>
            {loggedInUserName && howto._createdBy === loggedInUserName && (
              <Link to={'/how-to/' + this.props.howto.slug + '/edit'}>
                <Button variant={'primary'}>Edit</Button>
              </Link>
            )}
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
          <Text paragraph>{howto.description}</Text>

          <Flex mt={6} mb={2}>
            <StepsBox mr={4}>{howto.steps.length} steps</StepsBox>
            <TimeNeededBox mr={4}>{howto.time}</TimeNeededBox>
            <DifficultyLevelBox>{howto.difficulty_level}</DifficultyLevelBox>
          </Flex>
          <Flex mt={6} flexDirection={'column'}>
            {howto.files.map(file => (
              <FileInfo allowDownload file={file} key={file.name} />
            ))}
          </Flex>
        </Flex>
        <Flex justifyContent={'end'} width={[1, 1, 1 / 2]}>
          <CoverImg src={howto.cover_image.downloadUrl} alt="how-to cover" />
        </Flex>
      </HowToCard>
    )
  }
}
