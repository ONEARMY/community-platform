import * as React from 'react'
import { Card, Image, Box, Flex } from 'rebass'
import { Flex as FlexGrid } from '@rebass/grid'
// TODO add loader (and remove this material-ui dep)
import LinearProgress from '@material-ui/core/LinearProgress'
import Text from 'src/components/Text'
import { Link } from 'src/components/Links'
import styled from 'styled-components'
import TagsSelect from 'src/components/Tags/TagsSelect'

import { inject, observer } from 'mobx-react'
import { HowtoStore } from 'src/stores/Howto/howto.store'

import PpLogo from 'src/assets/images/pp-icon-small.png'

import { Button } from 'src/components/Button'
import { IHowto, IHowtoDB } from 'src/models/howto.models'
import { TagDisplay } from 'src/components/Tags/TagDisplay/TagDisplay'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'

interface InjectedProps {
  howtoStore?: HowtoStore
}

interface IState {
  isLoading: boolean
}

// TODO create Card component
const CardImage = styled(Image)`
  height: 230px;
  object-fit: cover;
  width: 100%;
`
const CardInfosContainer = styled(Box)`
  height: 120px;
`

const CardTitle = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

// First we use the @inject decorator to bind to the howtoStore state
@inject('howtoStore')
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
// (note 1, use ! to tell typescript that the store will exist (it's an injected prop))
// (note 2, mobx seems to behave more consistently when observables are referenced outside of render methods)
@observer
export class HowtoList extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = {
      isLoading: true,
    }
  }
  get injected() {
    return this.props as InjectedProps
  }

  public render() {
    const { filteredHowtos } = this.props.howtoStore
    const { isLoading } = this.state
    if (filteredHowtos) {
      return (
        <>
          <Flex flexWrap={'nowrap'} justifyContent={'space-between'}>
            <Box width={[1, 1, 0.2]}>
              <TagsSelect
                onChange={tags =>
                  this.props.howtoStore.updateSelectedTags(tags)
                }
                category="how-to"
              />
            </Box>
            <AuthWrapper>
              <Link to={'/how-to/create'}>
                <Button variant="outline" icon={'add'}>
                  create
                </Button>
              </Link>
            </AuthWrapper>
          </Flex>
          <React.Fragment>
            <div>
              <FlexGrid flexWrap={'wrap'} justifyContent={'space-between'}>
                {filteredHowtos.map((howto: IHowtoDB) => (
                  <Link
                    to={`/how-to/${encodeURIComponent(howto.slug)}`}
                    key={howto._id}
                  >
                    <Box my={4}>
                      <Card borderRadius={1} width={[380]} bg={'white'}>
                        <CardImage src={howto.cover_image.downloadUrl} />
                        <Box width={'45px'} bg="white" mt={'-24px'} ml={'29px'}>
                          <Image src={PpLogo} />
                        </Box>
                        <CardInfosContainer px={4} pb={3}>
                          <CardTitle fontSize={4} bold>
                            {howto.title}
                          </CardTitle>

                          <Text fontSize={1} mt={2} mb={3} color={'grey4'}>
                            by{' '}
                            <Text inline color={'black'}>
                              {howto._createdBy}
                            </Text>
                          </Text>
                          {howto.tags &&
                            Object.keys(howto.tags).map(tag => {
                              return <TagDisplay key={tag} tagKey={tag} />
                            })}
                        </CardInfosContainer>
                      </Card>
                    </Box>
                  </Link>
                ))}
              </FlexGrid>
            </div>
          </React.Fragment>
        </>
      )
    } else {
      return isLoading ? <LinearProgress /> : <div>How-tos not found</div>
    }
  }
}
