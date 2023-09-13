import { inject, observer } from 'mobx-react'
import {
  ArticleCallToAction,
  Button,
  Loader,
  UsefulStatsButton,
} from 'oa-components'
import * as React from 'react'
import type { RouteComponentProps } from 'react-router'
import { Redirect } from 'react-router'
import type { IHowtoDB } from 'src/models/howto.models'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import { Box } from 'theme-ui'
import { HowToComments } from './HowToComments/HowToComments'
import HowtoDescription from './HowtoDescription/HowtoDescription'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { seoTagsUpdate } from 'src/utils/seo'
import Step from './Step/Step'
import { trackEvent } from 'src/common/Analytics'
import { isUserVerifiedWithStore } from 'src/common/isUserVerified'
import type { UserComment } from 'src/models'
import type { AggregationsStore } from 'src/stores/Aggregations/aggregations.store'
import type { TagsStore } from 'src/stores/Tags/tags.store'
import type { UserStore } from 'src/stores/User/user.store'

// The parent container injects router props along with a custom slug parameter (RouteComponentProps<IRouterCustomParams>).
// We also have injected the doc store to access its methods to get doc by slug.
// We can't directly provide the store as a prop though, and later user a get method to define it

interface IRouterCustomParams {
  slug: string
}
interface InjectedProps extends RouteComponentProps<IRouterCustomParams> {
  howtoStore: HowtoStore
  userStore: UserStore
  aggregationsStore: AggregationsStore
  tagsStore: TagsStore
}
interface IState {
  howto?: IHowtoDB
  isLoading: boolean
  changedIsUseful?: boolean
}

@inject('howtoStore', 'userStore', 'aggregationsStore', 'tagsStore')
@observer
export class Howto extends React.Component<
  RouteComponentProps<IRouterCustomParams>,
  IState
> {
  private moderateHowto = async (accepted: boolean, feedback?: string) => {
    const _id = this.store.activeHowto?._id
    if (_id) {
      await this.store.moderateHowto(_id, accepted, feedback)
    }
  }

  private onUsefulClick = async (
    howtoId: string,
    howToSlug: string,
    eventCategory: string,
  ) => {
    const loggedInUser = this.store.activeUser
    if (!loggedInUser?.userName) {
      return null
    }

    this.store.toggleUsefulByUser(howtoId, loggedInUser?.userName)
    const hasUserVotedUseful = this.store.userVotedActiveHowToUseful

    trackEvent({
      category: eventCategory,
      action: hasUserVotedUseful ? 'HowtoUseful' : 'HowtoUsefulRemoved',
      label: howToSlug,
    })
  }

  //TODO: Typing Props
  constructor(props: any) {
    super(props)
    this.state = {
      isLoading: true,
    }
  }
  // workaround used later so that userStore can be called in render method when not existing on
  get injected() {
    return this.props as InjectedProps
  }

  get store() {
    return this.injected.howtoStore
  }

  public async componentDidMount() {
    const slug = this.props.match.params.slug
    await this.store.setActiveHowtoBySlug(slug)
    seoTagsUpdate({
      title: this.store.activeHowto?.title,
      description: this.store.activeHowto?.description,
      imageUrl: this.store.activeHowto?.cover_image?.downloadUrl,
    })
    this.setState({
      isLoading: false,
    })
  }

  public async componentWillUnmount() {
    seoTagsUpdate({})
    this.store.removeActiveHowto()
  }

  public render() {
    const { isLoading } = this.state
    const loggedInUser = this.injected.userStore.activeUser
    const { activeHowto } = this.store

    if (activeHowto) {
      const activeHowToComments: UserComment[] = this.store
        .getActiveHowToComments()
        .map(
          (c): UserComment => ({
            ...c,
            isEditable:
              [loggedInUser?._id, loggedInUser?.userName].includes(
                c._creatorId,
              ) || isAllowedToEditContent(activeHowto, loggedInUser),
          }),
        )

      const { allTagsByKey } = this.injected.tagsStore
      const howto = {
        ...activeHowto,
        taglist:
          activeHowto.tags &&
          Object.keys(activeHowto.tags)
            .map((t) => allTagsByKey[t])
            .filter(Boolean),
      }

      const hasUserVotedUseful = this.store.userVotedActiveHowToUseful

      return (
        <>
          <HowtoDescription
            howto={howto}
            key={activeHowto._id}
            needsModeration={this.store.needsModeration(activeHowto)}
            loggedInUser={loggedInUser}
            votedUsefulCount={this.store.votedUsefulCount}
            hasUserVotedUseful={hasUserVotedUseful}
            moderateHowto={this.moderateHowto}
            onUsefulClick={() =>
              this.onUsefulClick(howto._id, howto.slug, 'HowtoDescription')
            }
          />
          <Box mt={9}>
            {activeHowto.steps.map((step: any, index: number) => (
              <Step step={step} key={index} stepindex={index} />
            ))}
          </Box>
          <Box
            sx={{
              mt: 10,
              mb: 6,
              mx: 'auto',
              width: [`100%`, `${(4 / 5) * 100}%`, `${(2 / 3) * 100}%`],
            }}
          >
            <ArticleCallToAction
              author={{
                userName: howto._createdBy,
                countryCode: howto.creatorCountry,
                isVerified: isUserVerifiedWithStore(
                  howto._createdBy,
                  this.injected.aggregationsStore,
                ),
              }}
            >
              <Button
                sx={{ fontSize: 2 }}
                onClick={() => {
                  trackEvent({
                    category: 'ArticleCallToAction',
                    action: 'ScrollHowtoComment',
                    label: howto.slug,
                  })
                  document
                    .querySelector('[data-target="create-comment-container"]')
                    ?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  ;(
                    document.querySelector(
                      '[data-cy="comments-form"]',
                    ) as HTMLTextAreaElement
                  )?.focus()

                  return false
                }}
              >
                Leave a comment
              </Button>
              {howto.moderation === 'accepted' && (
                <UsefulStatsButton
                  votedUsefulCount={this.store.votedUsefulCount}
                  hasUserVotedUseful={hasUserVotedUseful}
                  isLoggedIn={!!loggedInUser}
                  onUsefulClick={() => {
                    this.onUsefulClick(
                      howto._id,
                      howto.slug,
                      'ArticleCallToAction',
                    )
                  }}
                />
              )}
            </ArticleCallToAction>
          </Box>
          <HowToComments comments={activeHowToComments} />
        </>
      )
    } else {
      return isLoading ? (
        <Loader />
      ) : (
        <Redirect
          to={{
            pathname: '/how-to',
            search:
              '?search=' +
              (this.props?.match?.params?.slug).replace(/\-/gi, ' ') +
              '&source=how-to-not-found',
          }}
        />
      )
    }
  }
}
