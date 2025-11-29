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
    cy.get('[data-cy=show-replies]').first().click();
    cy.get(`[data-cy="ReplyItem"]`).contains('First Reply');
  });

  it('allows users to sort comments', () => {
    const commenter = generateNewUserDetails();
    const project = MOCK_DATA.projects[1];
    const projectPath = `/library/${project.slug}`;

    const comment1 = `First comment ${randomId}`;
    const comment2 = `Second comment ${randomId}`;
    const comment3 = `Third comment ${randomId}`;
    const comment4 = `Fourth comment ${randomId}`;
    const comment5 = `Fifth comment ${randomId}`;

    cy.step('Create user and add five comments');
    cy.signUpNewUser(commenter);
    cy.completeUserProfile(commenter.username);
    cy.visit(projectPath);

    cy.addComment(comment1);
    cy.wait(1000);
    cy.get('[data-cy=comment-sort-select]').should('not.exist');

    cy.addComment(comment2);
    cy.wait(1000);
    cy.get('[data-cy=comment-sort-select]').should('not.exist');

    cy.addComment(comment3);
    cy.wait(1000);
    cy.get('[data-cy=comment-sort-select]').should('not.exist');

    cy.addComment(comment4);
    cy.wait(1000);
    cy.get('[data-cy=comment-sort-select]').should('not.exist');

    cy.addComment(comment5);
    cy.wait(1000);
    cy.get('[data-cy=comment-sort-select]').should('be.visible');

    cy.step('Mark first and third comments as useful');
    cy.get('[data-cy=comment-text]')
      .contains(comment1)
      .parents('[data-cy=OwnCommentItem]')
      .find('[data-cy=vote-useful]')
      .first()
      .click();
    cy.wait(1000);

    cy.get('[data-cy=comment-text]')
      .contains(comment3)
      .parents('[data-cy=OwnCommentItem]')
      .find('[data-cy=vote-useful]')
      .first()
      .click();
    cy.wait(1000);

    cy.reload();
    cy.wait(1000);

    cy.step('Sort dropdown is visible');
    cy.get('[data-cy=comment-sort-select]').should('be.visible');

    cy.step('Default sort is oldest - comment1 should be first');
    cy.get('[data-cy=comment-sort-select]').contains('Oldest');
    cy.get('[data-cy=comment-text]').first().should('contain', comment1);

    cy.step('Sort by newest - comment3 should be first');
    cy.get('[data-cy=comment-sort-select]').click();
    cy.contains('Newest').click();
    cy.get('[data-cy=comment-sort-select]').contains('Newest');
    cy.get('[data-cy=comment-text]').first().should('contain', comment5);

    cy.step('Sort by most useful - comment3 should be first (newer of the two useful)');
    cy.get('[data-cy=comment-sort-select]').click();
    cy.contains('Most Useful').click();
    cy.get('[data-cy=comment-sort-select]').contains('Most Useful');
    cy.get('[data-cy=comment-text]').first().should('contain', comment3);
    cy.get('[data-cy=comment-text]').eq(1).should('contain', comment1);

    cy.step('Sort back to oldest - comment1 should be first');
    cy.get('[data-cy=comment-sort-select]').click();
    cy.contains('Oldest').click();
    cy.get('[data-cy=comment-sort-select]').contains('Oldest');
    cy.get('[data-cy=comment-text]').first().should('contain', comment1);
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
