// This is basically an identical set of steps to the discussion tests for
// questions and projects. Any changes here should be replicated there.
import { MOCK_DATA } from '../../data'
import { research } from '../../fixtures/research'
import { generateAlphaNumeric } from '../../utils/TestUtils'

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
    const random = generateAlphaNumeric(8)
    const visitor = MOCK_DATA.users.subscriber
    const secondCommentor = MOCK_DATA.users.profile_views

    cy.addResearch(research, visitor.userName, random)
    cy.signIn(visitor.email, visitor.password)

    const newComment = `An example comment from ${visitor.userName}`
    const updatedNewComment = `I've updated my comment now. Love ${visitor.userName}`

    const researchPath = `/research/${visitor.userName}-in-discussion-research-${random}`

    cy.step('Can add comment')

    cy.visit(researchPath)
    cy.get(
      '[data-cy="HideDiscussionContainer: button open-comments no-comments"]',
    ).click()
    cy.contains('Start the discussion')
    cy.contains('0 comments')

    cy.addComment(newComment)
    cy.contains('1 Comment')

    cy.step('Can edit their comment')
    cy.editDiscussionItem('CommentItem', newComment, updatedNewComment)

    cy.step('Another user can add reply')
    const newReply = `An interesting point, I hadn't thought about that. All the best ${secondCommentor.userName}`
    const updatedNewReply = `I hadn't thought about that. Really good point. ${secondCommentor.userName}`

    cy.logout()

    cy.signIn(secondCommentor.email, secondCommentor.password)
    cy.visit(researchPath)
    cy.get(
      '[data-cy="HideDiscussionContainer: button open-comments has-comments"]',
    ).click()

    cy.addReply(newReply)
    cy.wait(1000)
    cy.contains('2 Comments')

    cy.step('Can edit their reply')
    cy.editDiscussionItem('ReplyItem', newReply, updatedNewReply)

    cy.step('First commentor can respond')
    const secondReply = `Quick reply. ${visitor.userName}`

    cy.logout()
    cy.signIn(visitor.email, visitor.password)
    cy.visit(researchPath)
    cy.get(
      '[data-cy="HideDiscussionContainer: button open-comments has-comments"]',
    ).click()

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
