// This is basically an identical set of steps to the discussion tests for
// questions and projects. Any changes here should be replicated there.
import { UserRole } from 'oa-shared'

import { MOCK_DATA } from '../../data'

describe('[Research.Discussions]', () => {
  it('can open using deep links', () => {
    // TODO find a way to test this
  })

  it('allows authenticated users to contribute to discussions', () => {
    localStorage.setItem('devSiteRole', UserRole.BETA_TESTER)

    const admin = MOCK_DATA.users.admin
    const secondCommentor = MOCK_DATA.users.profile_views

    cy.signIn(admin.email, admin.password)

    const newComment = `An example comment from ${admin.userName}`
    const updatedNewComment = `I've updated my comment now. Love ${admin.userName}`

    const research = MOCK_DATA.research[1]
    const researchPath = `/research/${research.slug}`

    cy.step('Can add comment')
    cy.visit(researchPath)
    cy.get('[data-cy="HideDiscussionContainer:button"]').click()
    cy.addComment(newComment)

    cy.step('Can edit their comment')
    cy.editDiscussionItem('CommentItem', newComment, updatedNewComment)

    cy.step('Another user can add reply')
    const newReply = `An interesting point, I hadn't thought about that. All the best ${secondCommentor.userName}`
    const updatedNewReply = `I hadn't thought about that. Really good point. ${secondCommentor.userName}`

    cy.logout()

    cy.signIn(secondCommentor.email, secondCommentor.password)
    cy.visit(researchPath)
    cy.get('[data-cy="HideDiscussionContainer:button"]').click()

    cy.addReply(newReply)
    cy.wait(1000)
    cy.contains('Comments')

    cy.step('Can edit their reply')
    cy.editDiscussionItem('ReplyItem', newReply, updatedNewReply)

    cy.step('First commentor can respond')
    const secondReply = `Quick reply. ${admin.userName}`

    cy.logout()
    cy.signIn(admin.email, admin.password)
    cy.visit(researchPath)

    cy.step('Notification generated for reply from replier')
    cy.expectNewNotification({
      content: updatedNewReply,
      path: researchPath,
      title: research.title,
      username: secondCommentor._id,
    })

    cy.visit(researchPath)

    cy.step('Can add reply')
    cy.get('[data-cy="HideDiscussionContainer:button"]').click()
    cy.addReply(secondReply)

    cy.step('Can delete their comment')
    cy.deleteDiscussionItem('CommentItem', updatedNewComment)

    cy.step('Replies still show for deleted comments')
    cy.get('[data-cy="deletedComment"]').should('be.visible')
    cy.get('[data-cy=OwnReplyItem]').contains(secondReply)

    cy.step('Can delete their reply')
    cy.deleteDiscussionItem('ReplyItem', secondReply)

    cy.step('Notification generated for secondCommentor from admin reply')
    cy.logout()
    cy.signIn(secondCommentor.email, secondCommentor.password)
    cy.expectNewNotification({
      content: secondReply,
      path: researchPath,
      title: research.title,
      username: admin.userName,
    })

    // Currently hard to test as the article is created via the seed
    //
    // cy.step(
    //   'Notification generated for research creator of the original comment only',
    // )
    // cy.logout()
    // cy.signIn(questionCreator.email, questionCreator.password)
    // cy.expectNewNotification({
    //   content: updatedNewReply,
    //   path: questionPath,
    //   title: question.title,
    //   username: replier.username,
    // })
  })
})
