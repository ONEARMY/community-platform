// This is basically an identical set of steps to the discussion tests for
// questions and research. Any changes here should be replicated there.
import { MOCK_DATA } from '../../data'
import { library } from '../../fixtures/library'
import { generateAlphaNumeric } from '../../utils/TestUtils'

const item = Object.values(MOCK_DATA.library)[0]
const libraryDiscussion = Object.values(MOCK_DATA.discussions).find(
  ({ sourceId }) => sourceId === item._id,
)

const visitor = MOCK_DATA.users.subscriber
const secondCommentor = MOCK_DATA.users.profile_views

describe('[Library.Discussions]', () => {
  it('can open using deep links', () => {
    const firstComment = libraryDiscussion.comments[0]
    cy.visit(`/library/${item.slug}#comment:${firstComment._id}`)
    cy.wait(2000)
    cy.checkCommentItem(firstComment.text, 2)
  })

  it('allows authenticated users to contribute to discussions', () => {
    const random = generateAlphaNumeric(8)

    cy.addProject(library, visitor.userName, random)
    cy.signIn(visitor.email, visitor.password)

    const newComment = `An interesting project. ${visitor.userName}`
    const updatedNewComment = `An interesting project. The answer must be that when the sky is red, the apocalypse _might_ be on the way. Yours, ${visitor.userName}`
    const newReply = `Thanks Dave and Ben. What does everyone else think? - ${visitor.userName}`
    const updatedNewReply = `Anyone else? All the best, ${visitor.userName}`
    const projectPath = `/library/howto-for-discussion-${visitor.userName}-${random}`

    cy.step('Can add comment')
    cy.visit(projectPath)
    cy.contains('Start the discussion')
    cy.contains('0 comments')
    cy.addComment(newComment)
    cy.contains('1 comment')

    cy.step('Can edit their comment')
    cy.editDiscussionItem('CommentItem', newComment, updatedNewComment)

    cy.step('Another user can add reply')
    cy.logout()
    cy.signIn(secondCommentor.email, secondCommentor.password)
    cy.visit(projectPath)
    cy.addReply(newReply)
    cy.wait(1000)
    cy.contains('2 comments')

    cy.step('Can edit their reply')
    cy.editDiscussionItem('ReplyItem', newReply, updatedNewReply)

    cy.step('Another user can leave a reply')
    const secondReply = `Quick reply. ${visitor.userName}`

    cy.step('First commentor can respond')
    cy.logout()
    cy.signIn(visitor.email, visitor.password)
    cy.visit(projectPath)

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
