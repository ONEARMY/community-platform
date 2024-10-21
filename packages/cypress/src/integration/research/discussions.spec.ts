// This is basically an identical set of steps to the discussion tests for
// questions and how-tos. Any changes here should be replicated there.

import { MOCK_DATA } from '../../data'
import { generateNewUserDetails } from '../../utils/TestUtils'

const item = Object.values(MOCK_DATA.research)[0]

const discussion = Object.values(MOCK_DATA.discussions).find(
  ({ sourceId }) => sourceId === item.updates[0]._id,
)

describe('[Research.Discussions]', () => {
  const firstComment = discussion.comments[0]

  it('can open using deep links', () => {
    const commentUrl = `/research/${item.slug}#update_${item.updates[0]._id}-comment:${firstComment._id}`
    cy.visit(commentUrl)
    cy.wait(2000)
    cy.checkCommentItem(firstComment.text, 1)
  })

  it('allows authenticated users to contribute to discussions', () => {
    const visitor = generateNewUserDetails()
    cy.signUpNewUser(visitor)
    cy.visit(`/research/${item.slug}`)

    const updateId = item.updates[0]._id
    const comment = `An example comment from ${visitor.username}`
    const updatedNewComment = `I've updated my comment now. Love ${visitor.username}`
    const newReply = `An interesting point, I hadn't thought about that. All the best ${visitor.username}`
    const updatedNewReply = `I hadn't thought about that. Really good point. ${visitor.username}`

    cy.step('Can create their own comment')
    cy.get(
      '[data-cy="HideDiscussionContainer: button open-comments has-comments"]',
    ).click()

    cy.get('[data-cy="comments-form"]').type(comment)
    cy.get('[data-cy="comment-submit"]').click()
    cy.get('[data-cy="OwnCommentItem"]').should('contain', comment)

    cy.step('Can edit their own comment')
    cy.editDiscussionItem('CommentItem', updatedNewComment)
    cy.get('[data-cy=OwnCommentItem]').contains(updatedNewComment)
    cy.get('[data-cy=OwnCommentItem]').contains('Edited less than a minute ago')
    cy.get('[data-cy=OwnCommentItem]').contains(comment).should('not.exist')

    cy.step('Can delete their own comment')
    cy.deleteDiscussionItem('CommentItem')
    cy.contains(updatedNewComment).should('not.exist')

    cy.step('Can add reply')
    cy.addReply(newReply)
    cy.contains(/\d+ Comments/)
    cy.contains(newReply)
    cy.wait(1000)
    cy.queryDocuments('research', '_id', '==', item._id).then((docs) => {
      const [research] = docs
      expect(research.latestCommentDate).to.not.eq(item.latestCommentDate)
    })

    cy.step('Can edit their reply')
    cy.editDiscussionItem('ReplyItem', updatedNewReply)
    cy.get('[data-cy=OwnReplyItem]').contains(updatedNewReply)
    cy.get('[data-cy=OwnReplyItem]').contains(newReply).should('not.exist')

    cy.step('Can delete their reply')
    cy.deleteDiscussionItem('ReplyItem')
    cy.contains(updatedNewReply).should('not.exist')
    cy.contains(`1 Comment`)

    cy.get(
      '[data-cy="HideDiscussionContainer: button close-comments has-comments"]',
    ).click()

    // Putting these at the end to avoid having to put a wait in the test
    cy.step('Comment generated a notification for primary research author')
    cy.queryDocuments('users', 'userName', '==', item._createdBy).then(
      (docs) => {
        const [user] = docs
        const discussionNotification = user.notifications.find(
          ({ type, triggeredBy }) =>
            type === 'new_comment_discussion' &&
            triggeredBy.userId === visitor.username,
        )
        expect(discussionNotification.relevantUrl).to.include(
          `/research/${item.slug}#update_${updateId}`,
        ),
          expect(discussionNotification.title).to.eq(item.title),
          expect(discussionNotification.triggeredBy.userId).to.eq(
            visitor.username,
          )
      },
    )

    cy.step('Comment generated a notification for update collaborators')
    cy.queryDocuments(
      'users',
      'userName',
      '==',
      item.updates[0].collaborators[0],
    ).then((docs) => {
      const [user] = docs
      const discussionNotification = user.notifications.find(
        ({ type, triggeredBy }) =>
          type === 'new_comment_discussion' &&
          triggeredBy.userId === visitor.username,
      )
      expect(discussionNotification.relevantUrl).to.include(
        `/research/${item.slug}#update_${updateId}`,
      ),
        expect(discussionNotification.title).to.eq(item.title),
        expect(discussionNotification.triggeredBy.userId).to.eq(
          visitor.username,
        )
    })

    cy.step('Reply generated a notification for comment parent')
    cy.queryDocuments('users', 'userName', '==', firstComment._creatorId).then(
      (docs) => {
        const [user] = docs
        const discussionNotification = user.notifications.find(
          ({ type, triggeredBy }) =>
            type === 'new_comment_discussion' &&
            triggeredBy.userId === visitor.username,
        )
        expect(discussionNotification.relevantUrl).to.include(
          `/research/${item.slug}#update_${updateId}`,
        )
        expect(discussionNotification.title).to.eq(item.title)
      },
    )
  })
})
