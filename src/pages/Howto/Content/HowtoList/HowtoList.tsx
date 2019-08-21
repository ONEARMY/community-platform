import * as React from 'react'
import { Image, Flex, Box } from 'rebass'
// TODO add loader (and remove this material-ui dep)
import { Link } from 'src/components/Links'
import { Button } from 'src/components/Button'
import { IHowto } from 'src/models/howto.models'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import MoreContainer from 'src/components/MoreContainer/MoreContainer'
import HowToCard from 'src/components/HowTo/HowToCard'
import Heading from 'src/components/Heading'

interface IProps {
  allHowtos: IHowto[]
}

export class HowtoList extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    const { allHowtos } = this.props
    return (
      <>
        <Flex py={26}>
          <Heading medium txtcenter width={1}>
            Learn & share how to recycle, make and hack plastic
          </Heading>
        </Flex>
        <Flex justifyContent={'flex-end'} mb={8}>
          <AuthWrapper>
            <Link to={'/how-to/create'}>
              <Button variant={'primary'}>Create a How-to</Button>
            </Link>
          </AuthWrapper>
        </Flex>
        <React.Fragment>
          {allHowtos.length === 0 ? (
            <Flex>
              <Heading auxiliary txtcenter width={1}>
                loading...
              </Heading>
            </Flex>
          ) : (
            <Flex flexWrap="wrap" mx={-4}>
              {allHowtos.map((howto: IHowto) => (
                <Flex px={4} py={4} width={[1, 1 / 2, 1 / 3]}>
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
          <MoreContainer
            text={'Connect with a likeminded community. All around the planet.'}
            buttonVariant={'primary'}
            buttonLabel={'Create an event'}
          />
        </React.Fragment>
      </>
    )
  }
}
