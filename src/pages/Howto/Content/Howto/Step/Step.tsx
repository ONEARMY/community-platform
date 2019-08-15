import React from 'react'
import Linkify from 'react-linkify'
import { IHowtoStep } from 'src/models/howto.models'
import { Box, Image, Flex } from 'rebass'
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
  border-radius: 10px;
  border: 2px solid black;
  height: fit-content;
`

const FlexStepContainer = styled(Flex)`
  border-radius: 10px;
  border: 2px solid black;
`

export default class Step extends React.PureComponent<IProps> {
  render() {
    return (
      <>
        <Flex mx={[-1, -2]} mt={9}>
          <Flex flex={1} mx={[1, 2]} width={1}>
            <FlexStepNumber
              justifyContent={'center'}
              py={4}
              px={4}
              bg={'white'}
              width={1}
            >
              <Text xxlarge mb={0}>
                {this.props.stepindex + 1}
              </Text>
            </FlexStepNumber>
          </Flex>
          <FlexStepContainer
            mx={[1, 2]}
            bg={'white'}
            flex={9}
            width={1}
            flexDirection={['column', 'row', 'row']}
          >
            <Flex
              width={[1, 4 / 9, 4 / 9]}
              py={4}
              px={4}
              flexDirection={'column'}
            >
              <Heading xxlarge mb={0}>
                {this.props.step.title}
              </Heading>
              <Box>
                <Text mt={3} color={'grey'}>
                  <Linkify>{this.props.step.text}</Linkify>
                </Text>
              </Box>
            </Flex>
            <Flex width={[1, 5 / 9, 5 / 9]}>
              <ImageGallery
                images={this.props.step.images as IUploadedFileMeta[]}
                caption={this.props.step.caption}
              />
              <Text pb={3}>{this.props.step.caption}</Text>
            </Flex>
          </FlexStepContainer>
        </Flex>
      </>
    )
  }
}
