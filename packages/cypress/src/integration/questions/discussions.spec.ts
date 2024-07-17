// This is basically an identical set of steps to the discussion tests for
// how-tos and research. Any changes here should be replicated there.

import { MOCK_DATA } from '../../data'
import { generateNewUserDetails } from '../../utils/TestUtils'

const questions = Object.values(MOCK_DATA.questions)

const item = questions[0]
const discussion = Object.values(MOCK_DATA.discussions).find(
  ({ sourceId }) => sourceId === item._id,
)

describe('[Questions.Discussions]', () => {
  it('can open using deep links', () => {
    const firstComment = discussion.comments[0]

    cy.signUpNewUser()
    cy.visit(`/questions/${item.slug}#comment:${firstComment._id}`)
    cy.checkCommentItem('@demo_user - I like your logo', 2)
  })

  it('allows authenticated users to contribute to discussions', () => {
    const newComment = 'An interesting question. The answer must be...'
    const updatedNewComment =
      'An interesting question. The answer must be that when the sky is red, the apocalypse _might_ be on the way.'
    const reply = 'Thanks Dave and Ben. What does everyone else think?'
    const updatedReply = 'Anyone else?'
    const secondReply = 'Quick reply'

    const visitor = generateNewUserDetails()
    cy.signUpNewUser(visitor)
    cy.visit(`/questions/${item.slug}`)

    cy.step('Can add comment')
    cy.addLastComment(newComment)
    cy.contains(`${discussion.comments.length + 1} comments`)
    cy.contains(newComment)

    cy.step('Can edit their comment')
    cy.editLast('CommentItem', updatedNewComment)
    cy.contains(updatedNewComment)
    cy.contains(newComment).should('not.exist')

    cy.step('Can add reply')
    cy.addReplytoFirstComment(reply)
    cy.contains(`${discussion.comments.length + 2} comments`)
    cy.contains(reply)
    cy.queryDocuments('questions', '_id', '==', item._id).then((docs) => {
      const [question] = docs
      expect(question.commentCount).to.eq(discussion.comments.length + 2)
      // Updated to the just added comment iso datetime
      expect(question.latestCommentDate).to.not.eq(item.latestCommentDate)
    })

    cy.step('Can edit their reply')
    cy.editLast('ReplyItem', updatedReply)
    cy.contains(updatedReply)
    cy.contains(reply).should('not.exist')

    cy.step('Can delete their reply')
    cy.deleteLast('ReplyItem')
    cy.contains(updatedReply).should('not.exist')

    // Prep for: Replies still show for deleted comments
    cy.get('[data-cy=show-replies]:last').click()
    cy.get('[data-cy=reply-form]:last').type(secondReply)
    cy.get('[data-cy=reply-submit]:last').click()
    cy.contains('[data-cy="Confirm.modal: Modal"]').should('not.exist')
    cy.get('[data-cy=ReplyItem]:last').contains(secondReply)

    cy.step('Can delete their comment')
    cy.deleteLast('CommentItem')
    cy.contains(updatedNewComment).should('not.exist')

    cy.step('Replies still show for deleted comments')
    cy.get('[data-cy="deletedComment"]').should('be.visible')
    cy.contains(secondReply)

    cy.step('Can delete their reply')
    cy.deleteLast('ReplyItem')
    cy.contains(updatedReply).should('not.exist')
    cy.contains(`${discussion.comments.length} comments`)
    cy.queryDocuments('questions', '_id', '==', item._id).then((docs) => {
      const [question] = docs
      expect(question.commentCount).to.eq(discussion.comments.length)
      expect(question.latestCommentDate).to.eq(item.latestCommentDate)
    })
    cy.contains('[data-cy=deletedComment]').should('not.exist')

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
          `/questions/${item.slug}#comment:`,
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
          `/questions/${item.slug}#comment:`,
        ),
          expect(discussionNotification.title).to.eq(item.title),
          expect(discussionNotification.triggeredBy.userId).to.eq(
            visitor.username,
          )
      },
    )

    cy.step('User avatars only visible to beta-testers')
    cy.contains('[data-cy=commentAvatar]').should('not.exist')
    cy.logout()
    cy.login('demo_beta_tester@example.com', 'demo_beta_tester')
    cy.visit(`/questions/${item.slug}`)
    cy.get('[data-cy="commentAvatar"]')
  })
})
