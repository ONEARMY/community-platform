import * as React from 'react'
import { Image, Flex, Box } from 'rebass'
// TODO add loader (and remove this material-ui dep)
import LinearProgress from '@material-ui/core/LinearProgress'
import Text from 'src/components/Text'
import { Link } from 'src/components/Links'
import styled from 'styled-components'
import { Button } from 'src/components/Button'
import { IHowto } from 'src/models/howto.models'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import MoreElementsButton from 'src/components/MoreLinks/MoreElementsButton'
import MoreDirectionModal from 'src/components/MoreLinks/MoreDirectionModal'
import ListPageTitle from 'src/components/Titles/ListPageTitle'
import HowToCard from 'src/components/HowTo/HowToCard'

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
        <ListPageTitle
          pageTitle={'Learn & share how to recycle, make and hack plastic'}
        />
        <Flex justifyContent={'flex-end'} mb={8}>
          <AuthWrapper>
            <Link to={'/how-to/create'}>
              <Button variant={'primary'}>Create a How-to</Button>
            </Link>
          </AuthWrapper>
        </Flex>
        <React.Fragment>
          {allHowtos.length === 0 ? (
            <LinearProgress />
          ) : (
            <Flex flexWrap="wrap" mx={-4}>
              {allHowtos.map((howto: IHowto) => (
                <Flex px={4} py={4} width={[1, 1 / 2, 1 / 3]}>
                  <HowToCard howto={howto} />
                </Flex>
              ))}
            </Flex>
          )}
          <MoreElementsButton
            buttonLink={'#'}
            buttonLabel={'More how-tos'}
            buttonVariant={'secondary'}
          />
          <MoreDirectionModal
            text={'Connect with a likeminded community. All around the planet.'}
            buttonVariant={'primary'}
            buttonLabel={'Create an event'}
          />
        </React.Fragment>
      </>
    )
  }
}
