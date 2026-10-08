import { users } from 'oa-shared/mocks/data';
import { MOCK_DATA } from '../../data';
import { generateAlphaNumeric, generateNewUserDetails, getTenantUser } from '../../utils/TestUtils';

let randomId;

describe('[Questions.Discussions]', () => {
  beforeEach(() => {
    randomId = generateAlphaNumeric(8).toLowerCase();
  });

  it('shows existing comments', () => {
    const question = MOCK_DATA.questions[0];
    cy.visit(`/questions/${question.slug}`);
    cy.get(`[data-cy=comment-text]`).contains('First comment');
    cy.get('[data-cy=show-replies]').first().click();
    cy.get(`[data-cy="ReplyItem"]`).contains('First Reply');
  });

  it('allows authenticated users to contribute to discussions', () => {
    const commenter = generateNewUserDetails();
    const question = MOCK_DATA.questions[2];
    const questionPath = `/questions/${question.slug}`;

    const newComment = `An interesting question. The answer must be... ${commenter.username}`;
    const updatedNewComment = `An interesting question. The answer must be that when the sky is red, the apocalypse _might_ be on the way. Love, ${commenter.username}. ${randomId}!`;
    const newReply = `Thanks Dave and Ben. What does everyone else think? - ${commenter.username}`;
    const updatedNewReply = `Anyone else? Your truly ${commenter.username}`;
    const secondReply = `Quick reply. ${randomId}? ${commenter.username}`;

    cy.signUpCompletedUser(commenter);

    cy.step('Can add comment');
    cy.visit(questionPath);
    cy.contains('Start the discussion');
    cy.get('[data-cy=follow-button]').should('contain', 'Follow Comments');
    cy.addComment(newComment);
    cy.reload();
    cy.get('[data-cy=follow-button]').should('contain', 'Following Comments');

    cy.step('Can edit their comment');
    cy.editDiscussionItem('CommentItem', newComment, updatedNewComment);

    cy.step('Another user can add reply');
    const replier = generateNewUserDetails();
    cy.logout();
    cy.signUpCompletedUser(replier);
    cy.visit(questionPath);
    cy.wait(1000);
    cy.get('[data-cy=CommentItem]').contains(updatedNewComment).should('be.visible');
    cy.addReply(newReply);
    cy.contains('Answers');

    cy.step('Can edit their reply');
    cy.editDiscussionItem('ReplyItem', newReply, updatedNewReply);
    cy.step('Another user can leave a reply');

    cy.step('First commentor can respond');
    cy.logout();
    cy.signIn(commenter.email, commenter.password);

    cy.step('Notification generated for reply from replier');
    cy.expectNewNotification({
      content: updatedNewReply,
      path: questionPath,
      username: replier.username,
    });
    cy.get('[data-cy=highlighted-comment]').contains(updatedNewReply);

    cy.visit(questionPath);

    cy.step('Can add reply');
    cy.addReply(secondReply);

    cy.step('Can delete their comment');
    cy.deleteDiscussionItem('CommentItem', updatedNewComment);

    cy.step('Replies still show for deleted comments');
    cy.get('[data-cy="deletedComment"]').should('be.visible');
    cy.get('[data-cy=OwnReplyItem]').contains(secondReply);

    cy.step('Can delete their reply');
    cy.deleteDiscussionItem('ReplyItem', secondReply);

    cy.step('Notification generated for replier from commenter reply');
    cy.logout();
    cy.signIn(replier.email, replier.password);
    cy.expectNewNotification({
      content: secondReply,
      path: questionPath,
      username: commenter.username,
    });
  });

  it('allows the question author or admins to mark an answer as accepted', () => {
    const demoAdmin = getTenantUser(users.admin);
    const question = MOCK_DATA.questions[0];
    const questionPath = `/questions/${question.slug}`;

    cy.step('Sign in as an admin (not the question author)');
    cy.signIn(demoAdmin.email, demoAdmin.password);
    cy.visit(questionPath);
    cy.wait(1000);

    cy.step('No accepted answer initially');
    cy.get('[data-cy=OwnCommentItem]').should('be.visible');
    cy.get('[data-cy=OwnCommentItem]').should('not.contain', 'Accepted answer');

    cy.step('Admin marks the existing comment as the accepted answer');
    cy.get('[data-cy="CommentItem: actions button"]').first().click();
    cy.get('[data-cy="CommentItem: mark-as-accepted button"]').should('contain', 'Mark as accepted answer').click();
    cy.wait(1000);
    cy.get('[data-cy=OwnCommentItem]').contains('Accepted answer').should('be.visible');

    cy.step('Accepted answer persists after reload');
    cy.reload();
    cy.get('[data-cy=OwnCommentItem]').contains('Accepted answer').should('be.visible');

    cy.step('Admin can unmark the accepted answer');
    cy.get('[data-cy="CommentItem: actions button"]').first().click();
    cy.get('[data-cy="CommentItem: mark-as-accepted button"]').should('contain', 'Unmark as accepted answer').click();
    cy.wait(1000);
    cy.get('[data-cy=OwnCommentItem]').should('not.contain', 'Accepted answer');

    cy.step('Unmarked state persists after reload');
    cy.reload();
    cy.get('[data-cy=OwnCommentItem]').should('not.contain', 'Accepted answer');
  });
});
