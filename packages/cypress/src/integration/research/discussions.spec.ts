// This is basically an identical set of steps to the discussion tests for
// questions and projects. Any changes here should be replicated there.

import { MOCK_DATA } from '../../data';
import { generateAlphaNumeric } from '../../utils/TestUtils';

let randomId;

describe('[Research.Discussions]', () => {
  beforeEach(() => {
    randomId = generateAlphaNumeric(10).toLowerCase();
  });

  it('can open using deep links', () => {
    // TODO find a way to test this
  });

  it('allows users to sort comments', () => {
    const admin = MOCK_DATA.users.admin;
    const research = MOCK_DATA.research[0];
    const researchPath = `/research/${research.slug}`;

    const comment1 = `First comment ${randomId}`;
    const comment2 = `Second comment ${randomId}`;
    const comment3 = `Third comment ${randomId}`;
    const comment4 = `Fourth comment ${randomId}`;
    const comment5 = `Fifth comment ${randomId}`;

    cy.step('Create admin user session and add five comments');
    cy.signIn(admin.email, admin.password);
    cy.visit(researchPath);
    //cy.get('[data-cy="HideDiscussionContainer:button"]').first().click();
    cy.get('[data-cy="HideDiscussionContainer:button"]').eq(1).click();

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
    cy.get('[data-cy="HideDiscussionContainer:button"]').eq(1).click();

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
    const admin = MOCK_DATA.users.admin;
    const secondCommentor = MOCK_DATA.users.profile_views;

    cy.signIn(admin.email, admin.password);

    const newComment = `An example comment from ${admin.username}`;
    const updatedNewComment = `I've updated my comment now. Love ${admin.username}. ${randomId}!`;

    const research = MOCK_DATA.research[1];
    const researchPath = `/research/${research.slug}`;

    cy.step('Can add comment');
    cy.visit(researchPath);
    cy.get('[data-cy="HideDiscussionContainer:button"]').first().click();
    cy.addComment(newComment);

    cy.step('Can edit their comment');
    cy.editDiscussionItem('CommentItem', newComment, updatedNewComment);

    cy.step('Another user can add reply');
    const newReply = `An interesting point, I hadn't thought about that. All the best ${secondCommentor.username}`;
    const updatedNewReply = `I hadn't thought about that. Really good point. ${secondCommentor.username}`;

    cy.logout();

    cy.signIn(secondCommentor.email, secondCommentor.password);
    cy.visit(researchPath);
    cy.get('[data-cy="HideDiscussionContainer:button"]').first().click();

    cy.addReply(newReply);
    cy.wait(1000);
    cy.contains('Comments');

    cy.step('Can edit their reply');
    cy.editDiscussionItem('ReplyItem', newReply, updatedNewReply);

    cy.step('First commentor can respond');
    const secondReply = `Quick reply. ${admin.username}. ${randomId}...`;

    cy.step('Notification generated for reply from replier');
    cy.logout();
    cy.signIn(admin.email, admin.password);
    cy.visit(researchPath);
    cy.expectNewNotification({
      content: updatedNewReply,
      path: researchPath,
      title: research.title,
      username: secondCommentor.username,
    });
    cy.wait(2000);
    cy.get('[data-cy=highlighted-comment]').contains(updatedNewReply);

    cy.visit(researchPath);

    cy.step('Can add reply');
    cy.get('[data-cy="HideDiscussionContainer:button"]').first().click();
    cy.addReply(secondReply);

    cy.step('Can delete their comment');
    cy.deleteDiscussionItem('CommentItem', updatedNewComment);

    cy.step('Replies still show for deleted comments');
    cy.get('[data-cy="deletedComment"]').should('be.visible');
    cy.get('[data-cy=OwnReplyItem]').contains(secondReply);

    cy.step('Can delete their reply');
    cy.deleteDiscussionItem('ReplyItem', secondReply);

    cy.step('Notification generated for secondCommentor from admin reply');
    cy.logout();
    cy.signIn(secondCommentor.email, secondCommentor.password);
    cy.expectNewNotification({
      content: secondReply,
      path: researchPath,
      title: research.title,
      username: admin.username,
    });

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
  });
});
