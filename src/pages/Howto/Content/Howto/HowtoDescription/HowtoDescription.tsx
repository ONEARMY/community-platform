import React from 'react'
import { TagDisplay } from 'src/components/Tags/TagDisplay/TagDisplay'
import { UploadedFile } from 'src/pages/common/UploadedFile/UploadedFile'
import { IHowto } from 'src/models/howto.models'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Box, Flex, Card } from 'rebass'
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
  constructor(props: any) {
    super(props)
  }
  public render() {
    const { howto } = this.props
    return (
      <Flex id="description">
        <Box width={[1, 1 / 2]}>
          <Text fontSize={1} mt={2} mb={3} color={'grey2'} p={1}>
            by&nbsp; &nbsp;|&nbsp;
            <Text inline color={'black'}>
              {/* TODO : Use proper date  */}4 days ago
            </Text>
          </Text>
          <Heading large>{howto.title}</Heading>
          <Text large>{howto.description}</Text>

          <Box my={3}>
            {Object.keys(howto.tags).map(k => (
              <TagDisplay tagKey={k} key={k} />
            ))}
          </Box>
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
          )}
          {howto.files.map(file => (
            <FileInfo file={file} key={file.name} />
          ))}
        </Box>
        <Box width={[1 / 2]}>
          <CoverImg src={howto.cover_image.downloadUrl} alt="how-to cover" />
        </Box>
      </Flex>
    )
  }
}
