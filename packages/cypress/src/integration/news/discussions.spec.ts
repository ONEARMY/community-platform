// This is basically an identical set of steps to the discussion tests for
// questions, projects and research. Any changes here should be replicated there.

import { MOCK_DATA } from '../../data';
import { generateAlphaNumeric, generateNewUserDetails } from '../../utils/TestUtils';

let randomId;

describe('[News.Discussions]', () => {
  beforeEach(() => {
    randomId = generateAlphaNumeric(8).toLowerCase();
  });

  it('shows existing comments', () => {
    const news = MOCK_DATA.news[0];
    cy.visit(`/news/${news.slug}`);
    cy.get(`[data-cy=comment-text]`).contains('First comment');
    cy.get('[data-cy=show-replies]').first().click();
    cy.get(`[data-cy="ReplyItem"]`).contains('First Reply');
  });

  it('allows users to sort comments', () => {
    const commenter = generateNewUserDetails();
    const news = MOCK_DATA.news[1];
    const newsPath = `/news/${news.slug}`;

    const comment1 = `First comment ${randomId}`;
    const comment2 = `Second comment ${randomId}`;
    const comment3 = `Third comment ${randomId}`;

    cy.step('Create user and add three comments');
    cy.signUpNewUser(commenter);
    cy.completeUserProfile(commenter.username);
    cy.visit(newsPath);

    cy.addComment(comment1);
    cy.wait(1000);
    cy.addComment(comment2);
    cy.wait(1000);
    cy.addComment(comment3);
    cy.wait(1000);

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

    cy.step('Default sort is newest - comment3 should be first');
    cy.get('[data-cy=comment-sort-select]').contains('Newest');
    cy.get('[data-cy=comment-text]').first().should('contain', comment3);

    cy.step('Sort by oldest - comment1 should be first');
    cy.get('[data-cy=comment-sort-select]').click();
    cy.contains('Oldest').click();
    cy.get('[data-cy=comment-sort-select]').contains('Oldest');
    cy.get('[data-cy=comment-text]').first().should('contain', comment1);

    cy.step('Sort by most useful - comment3 should be first (newer of the two useful)');
    cy.get('[data-cy=comment-sort-select]').click();
    cy.contains('Most Useful').click();
    cy.get('[data-cy=comment-sort-select]').contains('Most Useful');
    cy.get('[data-cy=comment-text]').first().should('contain', comment3);
    cy.get('[data-cy=comment-text]').eq(1).should('contain', comment1);

    cy.step('Sort back to newest');
    cy.get('[data-cy=comment-sort-select]').click();
    cy.contains('Newest').click();
    cy.get('[data-cy=comment-sort-select]').contains('Newest');
    cy.get('[data-cy=comment-text]').first().should('contain', comment3);
  });

  it('allows authenticated users to contribute to discussions', () => {
    const commenter = generateNewUserDetails();
    const news = MOCK_DATA.news[2];
    const newsPath = `/news/${news.slug}`;

    const newComment = `An interesting post. Glad here the good news. ${commenter.username}`;
    const updatedNewComment = `An interesting post. ${randomId}. Glad here the good news. Love, ${commenter.username}`;
    const newReply = `Thanks Community. I agree! - ${commenter.username}`;
    const updatedNewReply = `Anyone else? Yours truly ${commenter.username}`;
    const secondReply = `Quick reply. ${commenter.username}. ${randomId}`;

    cy.signUpNewUser(commenter);

    cy.step("Can't add comment with an incomplete profile");
    cy.visit(newsPath);

    cy.get('[data-cy=comments-form]').should('not.exist');
    cy.get('[data-cy=comments-incomplete-profile-prompt]').should('be.visible');

    cy.step('Can add comment when profile is complete');
    cy.completeUserProfile(commenter.username);
    cy.visit(newsPath);
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
    cy.visit(newsPath);
    cy.get('[data-cy=CommentItem]').contains(updatedNewComment).should('be.visible');
    cy.addReply(newReply);
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
      path: newsPath,
      title: news.title,
      username: replier.username,
    });
    cy.get('[data-cy=highlighted-comment]').contains(updatedNewReply);

    cy.visit(newsPath);

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
      path: newsPath,
      title: news.title,
      username: commenter.username,
    });

    // Currently hard to test as the news article is created via the seed
    //
    // cy.step(
    //   'Notification generated for news creator of the original comment only',
    // )
    // cy.logout()
    // cy.signIn(newsCreator.email, newsCreator.password)
    // cy.expectNewNotification({
    //   content: updatedNewReply,
    //   path: newsPath,
    //   title: news.title,
    //   username: replier.username,
    // })
  });
});
