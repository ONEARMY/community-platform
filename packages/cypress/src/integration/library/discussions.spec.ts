// This is basically an identical set of steps to the discussion tests for
// questions, projects and research. Any changes here should be replicated there.

import { MOCK_DATA } from '../../data';
import { generateAlphaNumeric, generateNewUserDetails } from '../../utils/TestUtils';

let randomId;

describe('[Library.Discussions]', () => {
  beforeEach(() => {
    randomId = generateAlphaNumeric(8).toLowerCase();
  });

  it('shows existing comments', () => {
    const project = MOCK_DATA.projects[0];
    cy.visit(`/library/${project.slug}`);
    cy.get(`[data-cy=comment-text]`).contains('First comment');
    cy.get('[data-cy=show-replies]').click();
    cy.get(`[data-cy="ReplyItem"]`).contains('First Reply');
  });

  it('allows authenticated users to contribute to discussions', () => {
    const commenter = generateNewUserDetails();
    const project = MOCK_DATA.projects[2];
    const projectPath = `/library/${project.slug}`;

    const newComment = `An interesting project. I'll be making myself. ${commenter.username}`;
    const updatedNewComment = `An interesting project. ${randomId}. I'll be making myself. Thanks ${commenter.username}!`;
    const newReply = `So glad for this guide. What does everyone else think? - ${commenter.username}`;
    const updatedNewReply = `Community - what else? Yours truly ${commenter.username}`;
    const secondReply = `Quick reply. ${commenter.username}. ${randomId}`;

    cy.signUpNewUser(commenter);

    cy.step("Can't add comment with an incomplete profile");
    cy.visit(projectPath);

    cy.get('[data-cy=comments-form]').should('not.exist');
    cy.get('[data-cy=comments-incomplete-profile-prompt]').should('be.visible');

    cy.step('Can add comment when profile is complete');
    cy.completeUserProfile(commenter.username);
    cy.visit(projectPath);
    cy.get('[data-cy=comments-incomplete-profile-prompt]').should('not.exist');

    cy.get('[data-cy=follow-button]').contains('Follow Comments');
    cy.addComment(newComment);
    cy.wait(2000);
    cy.reload();
    cy.get('[data-cy=follow-button]').contains('Following Comments');

    cy.step('Can edit their comment');
    cy.editDiscussionItem('CommentItem', newComment, updatedNewComment);

    cy.step('Another user can add reply');
    const replier = generateNewUserDetails();
    cy.logout();
    cy.signUpCompletedUser(replier);
    cy.visit(projectPath);
    cy.addReply(newReply);
    cy.wait(1000);
    cy.contains('Comments');

    cy.step('Can edit their reply');
    cy.editDiscussionItem('ReplyItem', newReply, updatedNewReply);
    cy.step('Another user can leave a reply');

    cy.step('First commenter can respond');
    cy.logout();
    cy.signIn(commenter.email, commenter.password);

    cy.step('Notification generated for reply from replier');
    cy.expectNewNotification({
      content: updatedNewReply,
      path: projectPath,
      title: project.title,
      username: replier.username,
    });
    cy.get('[data-cy=highlighted-comment]').contains(updatedNewReply);

    cy.visit(projectPath);

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
      path: projectPath,
      title: project.title,
      username: commenter.username,
    });
  });
});
