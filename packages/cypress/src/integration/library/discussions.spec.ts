// This is basically an identical set of steps to the discussion tests for
// questions and research. Any changes here should be replicated there.

import { ExternalLinkLabel } from 'oa-shared'

import { MOCK_DATA } from '../../data'
import { library } from '../../fixtures/library'
import { generateNewUserDetails } from '../../utils/TestUtils'

const item = Object.values(MOCK_DATA.library)[0]
const libraryDiscussion = Object.values(MOCK_DATA.discussions).find(
  ({ sourceId }) => sourceId === item._id,
)

describe('[Library.Discussions]', () => {
  it('can open using deep links', () => {
    const firstComment = libraryDiscussion.comments[0]
    cy.visit(`/library/${item.slug}#comment:${firstComment._id}`)
    cy.wait(2000)
    cy.checkCommentItem(firstComment.text, 2)
  })

  it('allows authenticated users to contribute to discussions', () => {
    const visitor = generateNewUserDetails()
    cy.addProject(library, visitor)
    cy.signUpNewUser(visitor)

    const newComment = `An interesting project. ${visitor.username}`
    const updatedNewComment = `An interesting project. The answer must be that when the sky is red, the apocalypse _might_ be on the way. Yours, ${visitor.username}`
    const newReply = `Thanks Dave and Ben. What does everyone else think? - ${visitor.username}`
    const updatedNewReply = `Anyone else? All the best, ${visitor.username}`

    const projectPath = `/library/howto-for-discussion-${visitor.username}`

    cy.step('Can add comment')
    cy.visit(projectPath)
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
    cy.visit(projectPath)
    cy.addReply(newReply)
    cy.wait(1000)
    cy.contains('2 comments')

    cy.step('Can edit their reply')
    cy.editDiscussionItem('ReplyItem', newReply, updatedNewReply)

    cy.step('Updating user settings shows on comments')
    cy.visit('/settings')
    cy.get('[data-cy=loader]').should('not.exist')
    cy.setSettingBasicUserInfo({
      country: 'Saint Lucia',
      description: "I'm a commenter",
      displayName: secondCommentor.username,
    })
    cy.setSettingImage('avatar', 'userImage')
    cy.setSettingAddContactLink({
      index: 0,
      label: ExternalLinkLabel.SOCIAL_MEDIA,
      url: 'http://something.to.delete/',
    })
    cy.saveSettingsForm()

    cy.step('Another user can leave a reply')
    const secondReply = `Quick reply. ${visitor.username}`

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
