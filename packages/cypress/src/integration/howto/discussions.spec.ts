// This is basically an identical set of steps to the discussion tests for
// questions and research. Any changes here should be replicated there.

import { ExternalLinkLabel } from 'oa-shared'

import { MOCK_DATA } from '../../data'
import { generateNewUserDetails } from '../../utils/TestUtils'

const howtos = Object.values(MOCK_DATA.howtos)

const item = howtos[0]
const howtoDiscussion = Object.values(MOCK_DATA.discussions).find(
  ({ sourceId }) => sourceId === item._id,
)

describe('[Howto.Discussions]', () => {
  it('can open using deep links', () => {
    const firstComment = howtoDiscussion.comments[0]
    cy.visit(`/how-to/${item.slug}#comment:${firstComment._id}`)
    cy.wait(2000)
    cy.checkCommentItem(firstComment.text, 2)
  })

  it('allows authenticated users to contribute to discussions', () => {
    const visitor = generateNewUserDetails()
    cy.signUpNewUser(visitor)
    cy.visit(`/how-to/${item.slug}`)

    const newComment = `An interesting howto. ${visitor.username}`
    const updatedNewComment = `An interesting howto. The answer must be that when the sky is red, the apocalypse _might_ be on the way. Yours, ${visitor.username}`
    const newReply = `Thanks Dave and Ben. What does everyone else think? - ${visitor.username}`
    const updatedNewReply = `Anyone else? All the best, ${visitor.username}`

    cy.step('Can add comment')
    cy.addComment(newComment)
    cy.contains(/\d+ comments/)
    cy.get('[data-cy=OwnCommentItem]').contains(newComment)

    cy.step('Updating user settings shows on comments')
    cy.visit('/settings')
    cy.get('[data-cy=loader]').should('not.exist')
    cy.setSettingBasicUserInfo({
      country: 'Saint Lucia',
      description: "I'm a commenter",
      displayName: visitor.username,
    })
    cy.setSettingImage('avatar', 'userImage')
    cy.setSettingAddContactLink({
      index: 0,
      label: ExternalLinkLabel.SOCIAL_MEDIA,
      url: 'http://something.to.delete/',
    })
    cy.saveSettingsForm()

    cy.get('[data-cy=page-link]').contains('How-to').click()
    cy.get('[data-cy-howto-slug="make-an-interlocking-brick"]').click()

    cy.get('[data-cy=OwnCommentItem]').get('[data-cy="country:LC"]')
    // cy.get('[data-cy="commentAvatarImage"]')
    //   .should('have.attr', 'src')
    //   .and('include', 'avatar')

    cy.step('Can edit their comment')
    cy.editDiscussionItem('CommentItem', updatedNewComment)
    cy.get('[data-cy="show-more-comments"]').click()
    cy.get('[data-cy=OwnCommentItem]').contains(updatedNewComment)
    cy.get('[data-cy=OwnCommentItem]').contains(newComment).should('not.exist')

    cy.step('Can delete their comment')
    cy.deleteDiscussionItem('CommentItem')
    cy.contains(updatedNewComment).should('not.exist')

    cy.step('Can add reply')
    cy.addReply(newReply)
    cy.get('[data-cy="show-more-comments"]').click()
    cy.contains(newReply)
    cy.queryDocuments('howtos', '_id', '==', item._id).then((docs) => {
      const [howto] = docs
      expect(howto.latestCommentDate).to.not.eq(item.latestCommentDate)
    })

    cy.step('Can edit their reply')
    cy.get('[data-cy="show-more-comments"]').click()
    cy.editDiscussionItem('ReplyItem', updatedNewReply)
    cy.contains(updatedNewReply)
    cy.contains(newReply).should('not.exist')

    cy.step('Can delete their reply')
    cy.deleteDiscussionItem('ReplyItem')
    cy.contains(updatedNewReply).should('not.exist')

    // Putting these at the end to avoid having to put a wait in the test
    cy.step('Comment generated notification for question author')
    cy.queryDocuments('users', 'userName', '==', item._createdBy).then(
      (docs) => {
        const [user] = docs
        const discussionNotification = user.notifications.find(
          ({ type, triggeredBy }) =>
            type === 'new_comment_discussion' &&
            triggeredBy.userId === visitor.username,
        )
        expect(discussionNotification.relevantUrl).to.include(
          `/how-to/${item.slug}#comment:`,
        ),
          expect(discussionNotification.title).to.eq(item.title),
          expect(discussionNotification.triggeredBy.userId).to.eq(
            visitor.username,
          )
      },
    )

    cy.step('Reply generates notification for comment author')
    cy.queryDocuments('users', 'userName', '==', 'howto_creator').then(
      (docs) => {
        const [user] = docs
        const discussionNotification = user.notifications.find(
          ({ type, triggeredBy }) =>
            type === 'new_comment_discussion' &&
            triggeredBy.userId === visitor.username,
        )
        expect(discussionNotification.relevantUrl).to.include(
          `/how-to/${item.slug}#comment:`,
        ),
          expect(discussionNotification.title).to.eq(item.title),
          expect(discussionNotification.triggeredBy.userId).to.eq(
            visitor.username,
          )
      },
    )
  })
})
