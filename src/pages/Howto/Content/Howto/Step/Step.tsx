import React from 'react'
import Linkify from 'react-linkify'
import { IHowtoStep } from 'src/models/howto.models'
import { Box } from 'rebass'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { IUploadedFileMeta } from 'src/stores/storage'
import ImageGallery from './ImageGallery'
import styled from 'styled-components'

interface IProps {
  step: IHowtoStep
  stepindex: number
}

const FlexStepNumber = styled(Flex)`
  height: fit-content;
`

export default class Step extends React.PureComponent<IProps> {
  render() {
    const { stepindex } = this.props
    return (
      <>
        <Flex
          data-cy={`step_${stepindex}`}
          mx={[0, 0, -2]}
          mt={9}
          flexDirection={['column', 'column', 'row']}
        >
          <Flex flex={1} mx={[0, 0, 2]} width={1} mb={[3, 3, 0]}>
            <FlexStepNumber
              card
              mediumRadius
              justifyContent={'center'}
              py={3}
              px={4}
              bg={'white'}
              width={1}
            >
              <Heading medium mb={0}>
                {this.props.stepindex + 1}
              </Heading>
            </FlexStepNumber>
          </Flex>
          <Flex
            card
            mediumRadius
            mx={[0, 0, 2]}
            bg={'white'}
            flex={9}
            width={1}
            flexDirection={['column', 'column', 'row']}
          >
            <Flex width={[1, 1, 4 / 9]} py={4} px={4} flexDirection={'column'}>
              <Heading medium mb={0}>
                {this.props.step.title}
              </Heading>
              <Box>
                <Text preLine paragraph mt={3} color={'grey'}>
                  <Linkify>{this.props.step.text}</Linkify>
                </Text>
              </Box>
            </Flex>
            <Flex width={[1, 1, 5 / 9]}>
              <ImageGallery
                images={this.props.step.images as IUploadedFileMeta[]}
                caption={this.props.step.caption}
              />
            </Flex>
          </Flex>
        </Flex>
      </>
    )
  }
}
