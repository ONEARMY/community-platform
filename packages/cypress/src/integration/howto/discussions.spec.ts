// This is basically an identical set of steps to the discussion tests for
// questions and research. Any changes here should be replicated there.

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

    cy.signUpNewUser()
    cy.visit(`/how-to/${item.slug}#comment:${firstComment._id}`)
    cy.wait(2000)
    cy.checkCommentItem(firstComment.text, 2)
  })

  it('allows authenticated users to contribute to discussions', () => {
    const newComment = 'An interesting howto. The answer must be...'
    const updatedNewComment =
      'An interesting howto. The answer must be that when the sky is red, the apocalypse _might_ be on the way.'
    const newReply = 'Thanks Dave and Ben. What does everyone else think?'
    const updatedNewReply = 'Anyone else?'

    const visitor = generateNewUserDetails()
    cy.signUpNewUser(visitor)
    cy.visit(`/how-to/${item.slug}`)

    cy.step('Can add comment')
    cy.addComment(newComment)
    cy.contains(/\d+ comments/)
    cy.contains(newComment)

    // The following step isn't possible to test atm due to the relationship between
    // the functions listen for changes and how cypress creates new document collections
    // for each test run.
    // cy.step('Updating user settings shows on comments')
    // cy.visit('/settings')
    // cy.setSettingBasicUserInfo({
    //     country: 'Saint Lucia',
    //     description: "I'm a commenter",
    //     displayName: visitor.username,
    //   })
    // cy.setSettingImage('avatar', 'userImage')
    // cy.setSettingAddContactLink({
    //   index: 0,
    //   label: ExternalLinkLabel.SOCIAL_MEDIA,
    //   url: 'http://something.to.delete/',
    // })
    // cy.saveSettingsForm()

    // cy.visit(`/how-to/${item.slug}`)
    // cy.get('[data-cy="country:lc"]')
    // cy.get('[data-cy="commentAvatarImage"]')
    //   .should('have.attr', 'src')
    //   .and('include', 'avatar')

    cy.step('Can edit their comment')
    cy.editDiscussionItem('CommentItem', updatedNewComment)
    cy.contains(updatedNewComment)
    cy.contains(newComment).should('not.exist')

    cy.step('Can delete their comment')
    cy.deleteDiscussionItem('CommentItem')
    cy.contains(updatedNewComment).should('not.exist')
    cy.contains(`${howtoDiscussion.comments.length} comments`)

    cy.step('Can add reply')
    cy.addReply(newReply)
    cy.contains(/\d+ comments/)
    cy.contains(newReply)
    cy.queryDocuments('howtos', '_id', '==', item._id).then((docs) => {
      const [howto] = docs
      expect(howto.totalComments).to.eq(howtoDiscussion.comments.length + 1)
      // Updated to the just added comment iso datetime
      expect(howto.latestCommentDate).to.not.eq(item.latestCommentDate)
    })

    cy.step('Can edit their reply')
    cy.editDiscussionItem('ReplyItem', updatedNewReply)
    cy.contains(updatedNewReply)
    cy.contains(newReply).should('not.exist')

    cy.step('Can delete their reply')
    cy.deleteDiscussionItem('ReplyItem')
    cy.contains(updatedNewReply).should('not.exist')
    cy.contains(`${howtoDiscussion.comments.length} comments`)
    cy.queryDocuments('howtos', '_id', '==', item._id).then((docs) => {
      const [howto] = docs
      expect(howto.totalComments).to.eq(howtoDiscussion.comments.length)
      expect(howto.latestCommentDate).to.eq(item.latestCommentDate)
    })

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
