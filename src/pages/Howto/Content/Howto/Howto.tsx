import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import LinearProgress from '@material-ui/core/LinearProgress'
import { afs } from 'src/utils/firebase'
import { inject } from 'mobx-react'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import HowtoDescription from './HowtoDescription/HowtoDescription'
import Step from './Step/Step'
import { Button } from 'src/components/Button'
import { IHowtoStep, IHowto } from 'src/models/howto.models'
import { Link } from 'react-router-dom'

// The parent container injects router props along with a custom slug parameter (RouteComponentProps<IRouterCustomParams>).
// We also have injected the doc store to access its methods to get doc by slug.
// We can't directly provide the store as a prop though, and later user a get method to define it
interface IRouterCustomParams {
  slug: string
}
interface InjectedProps extends RouteComponentProps<IRouterCustomParams> {
  howtoStore: HowtoStore
}
interface IState {
  howto?: IHowto
  isLoading: boolean
}
@inject('howtoStore')
export class Howto extends React.Component<
  RouteComponentProps<IRouterCustomParams>,
  IState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      howto: undefined,
      isLoading: true,
    }
  }
  // workaround used later so that userStore can be called in render method when not existing on
  get injected() {
    return this.props as InjectedProps
  }

  public async componentWillMount() {
    const slug = this.props.match.params.slug
    const doc = await this.injected.howtoStore.getDocBySlug(slug)
    this.setState({
      howto: doc,
      isLoading: false,
    })
  }
  // use firebase to query tutorials and return doc that matches the given slug
  public async getTutorialBySlug(slug: string) {
    const ref = afs
      .collection('documentation')
      .where('slug', '==', slug)
      .limit(1)
    const collection = await ref.get()
    return collection.docs.length > 0
      ? (collection.docs[0].data() as IHowto)
      : undefined
  }

  public renderMultipleImages(step: IHowtoStep) {
    const preloadedImages: any[] = []
    for (const image of step.images) {
      const imageObj = new Image()
      imageObj.src = image.downloadUrl
      preloadedImages.push({
        src: imageObj.src,
      })
    }
    return preloadedImages.map((image: any, index: number) => (
      <div className="step__image">
        <img src={image.src} />
      </div>
    ))
  }

  public renderUniqueImage(url: string) {
    return (
      <div className="step__image">
        <img src={url} />
      </div>
    )
  }
  public render() {
    const { howto, isLoading } = this.state
    if (howto) {
      return (
        <>
          <Link to={'/how-to'}>
            <Button variant={'outline'} m={50} icon={'arrow-back'}>
              Back to how-to
            </Button>
          </Link>
          <HowtoDescription howto={howto} />
          {howto.steps.map((step: any, index: number) => (
            <Step step={step} key={index} stepindex={index} />
          ))}
          <Link to={'/how-to'}>
            <Button variant={'outline'} mx={'auto'} my={50} icon={'arrow-back'}>
              Back to how-to
            </Button>
          </Link>
        </>
      )
    } else {
      return isLoading ? <LinearProgress /> : <div>How-to not found</div>
    }
  }
}
