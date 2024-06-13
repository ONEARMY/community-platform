// This is basically an identical set of steps to the discussion tests for
// questions and how-tos. Any changes here should be replicated there.

import { MOCK_DATA } from '../../data'
import { generateNewUserDetails } from '../../utils/TestUtils'

const item = Object.values(MOCK_DATA.research)[0]

const discussion = Object.values(MOCK_DATA.discussions).find(
  ({ sourceId }) => sourceId === item.updates[0]._id,
)

const firstComment = discussion.comments[0]

describe('[Research.Discussions]', () => {
  it('can open using deep links', () => {
    cy.visit(`/research/${item.slug}#update-0-comment:${firstComment._id}`)
    cy.get('[data-cy="comment"]').should('have.length.gte', 1)
    cy.get('[data-cy="comment"]').scrollIntoView().should('be.inViewport', 10)
    cy.contains(firstComment.text)
  })

  it('allows authenticated users to contribute to discussions', () => {
    const visitor = generateNewUserDetails()
    cy.signUpNewUser(visitor)
    cy.visit(`/research/${item.slug}`)

    const comment = 'An example comment'
    const updatedComment = "I've updated my comment now"
    const reply = "An interesting point, I hadn't thought about that."
    const updatedReply = "I hadn't thought about that. Really good point."

    cy.step('Can create their own comment')
    cy.get('[data-cy="HideDiscussionContainer: button open-comments"]')
      .first()
      .contains('View 1 comment')
      .click()
    cy.get('[data-cy="comments-form"]').type(comment)
    cy.get('[data-cy="comment-submit"]').click()
    cy.get('[data-cy=update_0]').contains('2 Comments')
    cy.get('[data-cy="comment"]').last().should('contain', comment)

    cy.step('Can edit their own comment')
    cy.get('[data-cy="comment"]')
      .last()
      .get(`[data-cy="CommentItem: edit button"]`)
      .click()
    cy.get('[data-cy=edit-comment]').clear().type(updatedComment)
    cy.get('[data-cy=edit-comment-submit]').click()
    cy.contains(updatedComment)
    cy.contains(comment).should('not.exist')

    cy.step('Can delete their own comment')
    cy.get('[data-cy="CommentItem: delete button"]:first').click()
    cy.get('[data-cy="Confirm.modal: Confirm"]:first').click()
    cy.contains(updatedComment).should('not.exist')

    cy.step('Can add reply')
    cy.get('[data-cy=show-replies]:first').click()
    cy.get('[data-cy=comments-form]:first').type(reply)
    cy.get('[data-cy=comment-submit]:first').click()
    cy.contains(`${discussion.comments.length + 1} Comments`)
    cy.contains(reply)
    cy.queryDocuments('research', '_id', '==', item._id).then((docs) => {
      const [research] = docs
      expect(research.totalCommentCount).to.eq(discussion.comments.length + 1)
      // Updated to the just added comment iso datetime
      expect(research.latestCommentDate).to.not.eq(item.latestCommentDate)
    })

    cy.step('Can edit their reply')
    cy.get('[data-cy="CommentItem: edit button"]:first').click()
    cy.get('[data-cy=edit-comment]').clear().type(updatedReply)
    cy.get('[data-cy=edit-comment-submit]').click()
    cy.contains(updatedReply)
    cy.contains(reply).should('not.exist')

    cy.step('Can delete their reply')
    cy.get('[data-cy="CommentItem: delete button"]:first').click()
    cy.get('[data-cy="Confirm.modal: Confirm"]:first').click()
    cy.contains(updatedReply).should('not.exist')
    cy.contains(`1 Comment`)
    cy.queryDocuments('research', '_id', '==', item._id).then((docs) => {
      const [research] = docs
      expect(research.totalCommentCount).to.eq(discussion.comments.length)
      expect(research.latestCommentDate).to.eq(item.latestCommentDate)
    })

    // Putting these at the end to avoid having to put a wait in the test
    /* Commenting because of Firebase Functions issue
    cy.step('Comment generated a notification for primary research author')
    cy.queryDocuments('users', 'userName', '==', item._createdBy).then(
      (docs) => {
        const [user] = docs
        console.log(user.notifications)
        const discussionNotification = user.notifications.find(
          ({ type }) => type === 'new_comment_discussion',
        )
        expect(discussionNotification.relevantUrl).to.include(
          `/research/${item.slug}#update_0`,
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
        ({ type }) => type === 'new_comment_discussion',
      )
      expect(discussionNotification.relevantUrl).to.include(
        `/research/${item.slug}#update_0`,
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
          ({ type }) => type === 'new_comment_discussion',
        )
        expect(discussionNotification.relevantUrl).to.include(
          `/research/${item.slug}#update_0`,
        ),
          expect(discussionNotification.title).to.eq(item.title),
          expect(discussionNotification.triggeredBy.userId).to.eq(
            visitor.username,
          )
      },
    )*/
  })
})
