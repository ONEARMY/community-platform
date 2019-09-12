import React from 'react'
import { TagDisplay } from 'src/components/Tags/TagDisplay/TagDisplay'
import differenceInDays from 'date-fns/difference_in_days'
import { IHowto } from 'src/models/howto.models'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box, Flex } from 'rebass'
import Icon from 'src/components/Icons'
import styled from 'styled-components'
import { FileInfo } from 'src/components/FileInfo/FileInfo'

interface IProps {
  howto: IHowto
}

export const CoverImg = styled.img`
  object-fit: cover;
  max-height: 360px;
  max-width: 600px;
  width: 100%;
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
    const { howto } = this.props
    return (
      <Flex id="description">
        <Box width={[1, 1 / 2]}>
          <Text fontSize={1} mt={2} mb={3} color={'grey2'} p={1}>
            by&nbsp;
            <Text inline bold color={'black'}>
              {howto._createdBy}
            </Text>
            &nbsp;|&nbsp;
            <Text inline color={'darkgrey'}>
              {this.durationSincePosted(new Date(howto._created))}
            </Text>
          </Text>
          <Heading large>{howto.title}</Heading>
          <Box my={3}>
            {howto.tags &&
              Object.keys(howto.tags).map(k => (
                <TagDisplay tagKey={k} key={k} />
              ))}
          </Box>
          <Text large preLine>
            {howto.description}
          </Text>

          <Flex width={1 / 2} my={3}>
            <Box width={1 / 3}>
              <Icon glyph={'step'} mr={2} verticalAlign={'bottom'} />
              {howto.steps.length} steps
            </Box>
            <Box width={1 / 3}>
              <Icon glyph={'time'} mr={2} verticalAlign={'bottom'} />
              {howto.time}
            </Box>
            <Box width={1 / 3}>
              <Icon glyph={'difficulty'} mr={2} verticalAlign={'bottom'} />
              {howto.difficulty_level}
            </Box>
          </Flex>
          {howto.files.length > 0 && (
              <Text>
                <b>Files : </b>
              </Text>
            ) &&
            howto.files.map(file => (
              <FileInfo allowDownload file={file} key={file.name} />
            ))}
        </Box>
        <Flex justifyContent={'end'} width={[1 / 2]}>
          <Box>
            <CoverImg src={howto.cover_image.downloadUrl} alt="how-to cover" />
            <Text pt={2}>{howto.caption}</Text>
          </Box>
        </Flex>
      </Flex>
    )
  }
}
