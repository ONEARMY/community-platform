import * as React from 'react'
import { Card, Image, Box, Flex } from 'rebass'
import { Flex as FlexGrid } from '@rebass/grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Text from 'src/components/Text'
import Heading from 'src/components/Heading'
import { Link } from 'src/components/Links'
import styled from 'styled-components'

import PpLogo from 'src/assets/images/pp-icon-small.png'

import { Button } from 'src/components/Button'
import { IHowto } from 'src/models/howto.models'
import { TagDisplay } from 'src/components/Tags/TagDisplay/TagDisplay'

interface IProps {
  allHowtos: IHowto[]
}

// TODO create Card component
const CardImage = styled(Image)`
  height: 230px;
  object-fit: cover;
  width: 100%;
`
const CardInfosContainer = styled(Box)`
  height: 170px;
`

export class HowtoList extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    const { allHowtos } = this.props
    return (
      <>
        <Flex justifyContent={'right'}>
          <Link to={'/how-to/create'}>
            <Button variant="outline" icon={'add'}>
              create
            </Button>
          </Link>
        </Flex>
        <React.Fragment>
          <div>
            {allHowtos.length === 0 ? (
              <LinearProgress />
            ) : (
              <FlexGrid flexWrap={'wrap'} justifyContent={'center'} my={4}>
                {allHowtos.map((howto: IHowto, index: number) => (
                  <Box m={2}>
                    <Card borderRadius={1} width={[380]} bg={'white'}>
                      <CardImage
                        src={
                          howto.cover_image
                            ? howto.cover_image.downloadUrl
                            : howto.cover_image_url
                        }
                      />
                      <Box width={'45px'} bg="white" mt={'-24px'} ml={'29px'}>
                        <Image src={PpLogo} />
                      </Box>
                      <CardInfosContainer px={4} pb={3}>
                        <Link to={`/how-to/${encodeURIComponent(howto.slug)}`}>
                          <Heading small bold>
                            {howto.tutorial_title}
                          </Heading>
                        </Link>
                        <Text fontSize={1} mt={2} mb={3} color={'grey4'}>
                          by{' '}
                          <Text inline color={'black'}>
                            {howto.workspace_name}
                          </Text>
                        </Text>
                        {Object.keys(howto.tags).map(tag => {
                          return <TagDisplay key={tag} tagKey={tag} />
                        })}
                      </CardInfosContainer>
                    </Card>
                  </Box>
                ))}
              </FlexGrid>
            )}
          </div>
          {allHowtos.length > 15 ? (
            <Link to={'/how-to/create'}>
              <Button mx={'auto'} my={50} icon={'add'}>
                create how-to
              </Button>
            </Link>
          ) : null}
        </React.Fragment>
      </>
    )
  }
}
