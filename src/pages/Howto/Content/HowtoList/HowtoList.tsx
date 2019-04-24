import * as React from 'react'
import { Link } from 'react-router-dom'
import { Card, Image, Box } from 'rebass'
import { Flex as FlexGrid } from '@rebass/grid'
import LinearProgress from '@material-ui/core/LinearProgress'
import Text from 'src/components/Text'
import Heading from 'src/components/Heading'
import styled from 'styled-components'

import { Button } from 'src/components/Button'
import { IHowto } from 'src/models/howto.models'
import { maxContainerWidth } from 'src/themes/styled.theme'

interface IProps {
  allHowtos: IHowto[]
}

const FlexGridContainer = styled(FlexGrid)`
  flex-wrap: wrap;
  max-width: ${maxContainerWidth + 'px'};
  margin: 0 auto;
`

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
      <div>
        <Link to={'/how-to/create'}>
          <Button variant="outline" mx={'auto'} my={3} icon={'add'}>
            create
          </Button>
        </Link>
        <React.Fragment>
          <div>
            {allHowtos.length === 0 ? (
              <LinearProgress />
            ) : (
              <FlexGridContainer>
                {allHowtos.map((howto: IHowto, index: number) => (
                  <Box m={2}>
                    <Card borderRadius={1} width={380} bg={'white'}>
                      <CardImage
                        src={
                          howto.cover_image
                            ? howto.cover_image.downloadUrl
                            : howto.cover_image_url
                        }
                      />
                      <CardInfosContainer px={2}>
                        <Link to={`/how-to/${encodeURIComponent(howto.slug)}`}>
                          <Heading medium>{howto.tutorial_title}</Heading>
                        </Link>
                        <Text small>
                          by <b>{howto.workspace_name}</b>
                        </Text>
                      </CardInfosContainer>
                    </Card>
                  </Box>
                ))}
              </FlexGridContainer>
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
      </div>
    )
  }
}
