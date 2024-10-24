// This is basically an identical set of steps to the discussion tests for
// how-tos and research. Any changes here should be replicated there.

import { MOCK_DATA } from '../../data'
import { question } from '../../fixtures/question'
import { generateNewUserDetails } from '../../utils/TestUtils'

describe('[Questions.Discussions]', () => {
  it('can open using deep links', () => {
    const item = Object.values(MOCK_DATA.questions)[0]
    const discussion = Object.values(MOCK_DATA.discussions).find(
      ({ sourceId }) => sourceId === item._id,
    )

    const firstComment = discussion.comments[0]
    cy.visit(`/questions/${item.slug}#comment:${firstComment._id}`)
    cy.wait(2000)
    cy.checkCommentItem('@demo_user - I like your logo', 2)
  })

  it('allows authenticated users to contribute to discussions', () => {
    const visitor = generateNewUserDetails()
    cy.addQuestion(question, visitor)
    cy.signUpNewUser(visitor)

    const newComment = `An interesting question. The answer must be... ${visitor.username}`
    const updatedNewComment = `An interesting question. The answer must be that when the sky is red, the apocalypse _might_ be on the way. Love, ${visitor.username}`
    const newReply = `Thanks Dave and Ben. What does everyone else think? - ${visitor.username}`
    const updatedNewReply = `Anyone else? Your truly ${visitor.username}`

    const questionPath = `/questions/quick-question-for-${visitor.username}`

    cy.step('Can add comment')
    cy.visit(questionPath)
    cy.contains('Start the discussion')
    cy.contains('0 comments')
    cy.addComment(newComment)
    cy.contains('1 comment')

    cy.step('Can edit their comment')
    cy.editDiscussionItem('CommentItem', newComment, updatedNewComment)

    cy.step('Another user can add reply')
    const secondCommentor = generateNewUserDetails()

    cy.logout()
    cy.signUpNewUser(secondCommentor)
    cy.visit(questionPath)
    cy.addReply(newReply)
    cy.wait(1000)
    cy.contains('2 comments')

    cy.step('Can edit their reply')
    cy.editDiscussionItem('ReplyItem', newReply, updatedNewReply)

    cy.step('Another user can leave a reply')
    const secondReply = `Quick reply. ${visitor.username}`

    cy.step('First commentor can respond')
    cy.logout()
    cy.login(visitor.email, visitor.password)
    cy.visit(questionPath)

    cy.addReply(secondReply)

    cy.step('Can delete their comment')
    cy.deleteDiscussionItem('CommentItem', updatedNewComment)

    cy.step('Replies still show for deleted comments')
    cy.get('[data-cy="deletedComment"]').should('be.visible')
    cy.get('[data-cy=OwnReplyItem]').contains(secondReply)

    cy.step('Can delete their reply')
    cy.deleteDiscussionItem('ReplyItem', secondReply)
  })
})
