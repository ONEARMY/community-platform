// This is basically an identical set of steps to the discussion tests for
// questions and how-tos. Any changes here should be replicated there.

import { ExternalLinkLabel } from 'oa-shared'

import { MOCK_DATA } from '../../data'
import { research } from '../../fixtures/research'
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
    cy.addResearch(research, visitor)
    cy.signUpNewUser(visitor)

    const newComment = `An example comment from ${visitor.username}`
    const updatedNewComment = `I've updated my comment now. Love ${visitor.username}`

    const researchPath = `/research/${visitor.username}-in-discussion-research`

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
    const secondCommentor = generateNewUserDetails()
    const newReply = `An interesting point, I hadn't thought about that. All the best ${secondCommentor.username}`
    const updatedNewReply = `I hadn't thought about that. Really good point. ${secondCommentor.username}`

    cy.logout()

    cy.signUpNewUser(secondCommentor)
    cy.visit(researchPath)
    cy.get(
      '[data-cy="HideDiscussionContainer: button open-comments has-comments"]',
    ).click()

    cy.addReply(newReply)
    cy.wait(1000)
    cy.contains('2 Comments')

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

    cy.step('First commentor can respond')
    const secondReply = `Quick reply. ${visitor.username}`

    cy.logout()
    cy.login(visitor.email, visitor.password)
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
