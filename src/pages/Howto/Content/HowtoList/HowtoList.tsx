import * as React from 'react'
import { Flex } from 'rebass'
// TODO add loader (and remove this material-ui dep)
import { Link } from 'src/components/Links'
import TagsSelect from 'src/components/Tags/TagsSelect'

import { inject, observer } from 'mobx-react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { Button } from 'src/components/Button'
import { IHowtoDB } from 'src/models/howto.models'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import MoreContainer from 'src/components/MoreContainer/MoreContainer'
import HowToCard from 'src/components/HowToCard/HowToCard'
import Heading from 'src/components/Heading'

interface InjectedProps {
  howtoStore?: HowtoStore
}

interface IState {
  isLoading: boolean
}

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
    return (
      <>
        <Flex py={26}>
          <Heading medium bold txtcenter width={1} my={20}>
            Learn & share how to recycle, make and hack plastic
          </Heading>
        </Flex>
        <Flex
          flexWrap={'nowrap'}
          justifyContent={'space-between'}
          flexDirection={['column-reverse', 'column-reverse', 'row']}
        >
          <Flex width={[1, 1, 0.2]}>
            <TagsSelect
              onChange={tags => this.props.howtoStore.updateSelectedTags(tags)}
              category="how-to"
              styleVariant="filter"
              placeholder="Filter How-tos by tag"
            />
          </Flex>
          <AuthWrapper>
            <Flex justifyContent={['flex-end', 'flex-end', 'auto']}>
              <Link to={'/how-to/create'} mb={[3, 3, 0]}>
                <Button variant={'primary'} translateY>
                  Create a How-to
                </Button>
              </Link>
            </Flex>
          </AuthWrapper>
        </Flex>
        <React.Fragment>
          {filteredHowtos.length === 0 ? (
            <Flex>
              <Heading auxiliary txtcenter width={1}>
                loading...
              </Heading>
            </Flex>
          ) : (
            <Flex flexWrap="wrap" mx={-4}>
              {filteredHowtos.map((howto: IHowtoDB) => (
                <Flex key={howto._id} px={4} py={4} width={[1, 1 / 2, 1 / 3]}>
                  <HowToCard howto={howto} />
                </Flex>
              ))}
            </Flex>
          )}
          <Flex justifyContent={'center'} mt={20}>
            <Link to={'#'}>
              <Button variant={'secondary'}>More how-tos</Button>
            </Link>
          </Flex>
          <MoreContainer m={'0 auto'} pt={60} pb={90}>
            <Flex alignItems={'center'} flexDirection={'column'} mt={5}>
              <Heading medium>Inspire the Precious Plastic world.</Heading>
              <Heading medium>Share your how-to!</Heading>
              <AuthWrapper>
                <Link to={'/how-to/create'}>
                  <Button variant="primary" mt={30}>
                    Create a howto
                  </Button>
                </Link>
              </AuthWrapper>
            </Flex>
          </MoreContainer>
        </React.Fragment>
      </>
    )
  }
}
