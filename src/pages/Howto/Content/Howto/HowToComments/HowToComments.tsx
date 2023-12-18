import { Box, Flex } from 'theme-ui'
import {
  ArticleCallToAction,
  Button,
  UsefulStatsButton,
  UserEngagementWrapper,
} from 'oa-components'

import { isUserVerifiedWithStore } from 'src/common/isUserVerified'
import { useCommonStores } from 'src/index'
import { Discussion } from 'src/pages/common/Discussion/Discussion'

import type { IHowtoDB, UserComment } from 'src/models'

interface IProps {
  comments: UserComment[]
  howto: IHowtoDB
}

export const HowToComments = ({ comments, howto }: IProps) => {
  const { aggregationsStore, howtoStore, userStore } = useCommonStores().stores
  const user = userStore.activeUser
  const author = {
    userName: howto._createdBy,
    countryCode: howto.creatorCountry,
    isVerified: isUserVerifiedWithStore(howto._createdBy, aggregationsStore),
  }

  return (
    <UserEngagementWrapper>
      <Box sx={{}}>
        <ArticleCallToAction author={author}>
          <Button
            sx={{ fontSize: 2 }}
            onClick={() => {
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
              votedUsefulCount={howtoStore.votedUsefulCount}
              hasUserVotedUseful={howtoStore.userVotedActiveHowToUseful}
              isLoggedIn={!!user}
              onUsefulClick={() => {
                howtoStore.toggleUsefulByUser(howto._id, user?.userName || '')
              }}
            />
          )}
        </ArticleCallToAction>
      </Box>

      <Flex
        mt={5}
        sx={{ flexDirection: 'column', alignItems: 'center' }}
        data-cy="howto-comments"
      >
        <Flex
          mb={4}
          sx={{
            width: [`100%`, `${(4 / 5) * 100}%`, `${(2 / 3) * 100}%`],
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Discussion comments={comments} parent={howto} store={howtoStore} />
        </Flex>
      </Flex>
    </UserEngagementWrapper>
  )
}
