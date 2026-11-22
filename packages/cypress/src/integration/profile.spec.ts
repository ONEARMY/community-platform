import { faker } from '@faker-js/faker';

import { MESSAGE_MAX_CHARACTERS } from '../../../../src/pages/User/constants';
import { contact } from '../../../../src/pages/User/labels';
import { MOCK_DATA } from '../data';
import { UserMenuItem } from '../support/commandsUi';
import { generateNewUserDetails, getTenantUser } from '../utils/TestUtils';

const subscriber = getTenantUser(MOCK_DATA.users.subscriber);
const eventReader = getTenantUser(MOCK_DATA.users.event_reader);
const workspacePopulated = getTenantUser(MOCK_DATA.users.settings_workplace_new);
const workspaceEmpty = getTenantUser(MOCK_DATA.users.settings_workplace_empty);

describe('[Profile]', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('[By Anonymous]', () => {
    it('[Can view all public profile information]', () => {
      cy.step('Go to Profile');
      cy.visit(`/u/${eventReader.username}`);
      cy.title().should('eq', `${eventReader.displayName} - Profile - Test Site`);

      cy.get('[data-cy=userDisplayName]').contains(eventReader.username);
      cy.get('[data-testid=library-contributions]').find('[data-testid=library-link]').should('have.length', 1);
      cy.get('[data-testid=research-contributions]').should('exist');

      cy.get('[data-cy=emptyProfileMessage]').should('not.exist');
    });
  });

  describe('[By User]', () => {
    it('[User directed to own profile]', () => {
      const user = generateNewUserDetails();
      cy.signUpNewUser(user);
      cy.setProfileUsername(user.username);
      cy.visit('/');

      cy.step('Go to Profile');
      cy.clickMenuItem(UserMenuItem.Profile);
      cy.url().should('include', `/u/${user.username}`);
      cy.get('[data-cy=SpaceProfile]').should('not.exist');
      cy.get('[data-cy=MemberProfile]').should('be.visible');
      cy.get('.beta-tester-feature').should('not.exist');
      cy.get('[data-cy=emptyProfileMessage]').should('be.visible');
    });

    it('[Contact form]', () => {
      const contactee = generateNewUserDetails();

      cy.step('Can sign-up and have a contact form');
      cy.signUpNewUser(contactee);
      cy.setProfileUsername(contactee.username);
      cy.visit(`/u/${contactee.username}`);
      cy.get('[data-cy="UserContactForm-Available"]');

      cy.step("Logged out people can see that they're contactable");
      cy.logout();
      cy.visit(`/u/${contactee.username}`);
      cy.get('[data-cy=SendMessageButton]').click();
      cy.get('[data-cy="UserContactNotLoggedIn"]');

      cy.step('Other users can contact people');
      const contacter = generateNewUserDetails();
      cy.signUpNewUser(contacter);
      cy.setProfileUsername(contacter.username);
      cy.visit(`/u/${contactee.username}`);
      cy.get('[data-cy=SendMessageButton]').click();
      cy.get('[data-cy="UserContactForm"]').should('be.visible');

      cy.step('Form errors without a message');
      cy.get('[data-cy=contact-submit]').click();
      cy.contains('This field is required').should('be.visible');

      cy.step('Contact form will send');
      const message = faker.lorem.sentences(50).slice(0, MESSAGE_MAX_CHARACTERS).trim();

      cy.get('[data-cy=message]').type(message, { delay: 0 });
      cy.get('[data-cy=contact-submit]').click();
      cy.contains(contact.successMessage);

      cy.step('Can opt-out of being contacted');
      cy.logout();
      cy.signIn(contactee.email, contactee.password);
      cy.completeUserProfile(contactee.username);
      cy.get('[data-cy=PublicContactSection]').should('be.visible');
      cy.get('[data-cy=isContactable-true]').click({ force: true });
      cy.saveSettingsForm();
      cy.get('[data-cy=isContactable-false]');

      cy.step('No contact section visible for contactee');
      cy.visit(`/u/${contactee.username}`);
      cy.get('[data-cy=UserContactWrapper]').should('not.exist');

      cy.step('No contact section visible for logged out users');
      cy.logout();
      cy.visit(`/u/${contactee.username}`);
      cy.get('[data-cy=UserContactWrapper]').should('not.exist');

      cy.step('No contact section visible for other users');
      cy.signIn(contacter.email, contacter.password);
      cy.visit(`/u/${contactee.username}`);
      cy.get('[data-cy=UserContactWrapper]').should('not.exist');

      cy.step('Contact section shows when website link is present');
      cy.logout();
      cy.signIn(contactee.email, contactee.password);
      cy.visit('/settings');
      cy.get('[data-cy=website').clear().type('https://bbc.co.uk');
      cy.saveSettingsForm();

      cy.visit(`/u/${contactee.username}`);
      cy.get('[data-cy=UserContactWrapper]');
      cy.get('[data-cy="UserContactForm-NotAvailable"]');
      cy.get('[data-cy="UserContactForm"]').should('not.exist');
      cy.get('[data-cy="profile-website"]').should('have.attr', 'href', `https://bbc.co.uk`);

      cy.step('Contact section shows for everyone else');
      cy.logout();
      cy.visit(`/u/${contactee.username}`);
      cy.get('[data-cy="UserContactForm-NotAvailable"]').should('not.exist');
    });

    it('[Can see contribution data for workspaces]', () => {
      cy.signIn(subscriber.email, subscriber.password);

      cy.step('Can go to contribution data');
      cy.visit(`/u/${workspacePopulated.username}`);
      cy.contains('Contributions').should('be.visible');
    });

    it('[Contribution and Impact sections hidden without contributions]', () => {
      cy.signIn(subscriber.email, subscriber.password);

      cy.step('Ensure hidden with no contributions');
      cy.visit(`/u/${workspaceEmpty.username}`);
      cy.get('[data-cy=MemberProfile]').should('not.exist');
      cy.get('[data-cy=SpaceProfile]').should('be.visible');

      cy.contains('Contributions').should('not.exist');
      cy.get('[data-cy=ImpactPanel]').should('not.exist');
    });
  });

  describe('badges', () => {
    it('should be shown across the platform', () => {
      cy.step('On profile');
      cy.visit(`/u/${subscriber.username}`);
      cy.get('[data-testid="badge_pro"]').contains('PRO');

      cy.step('On project pages');
      cy.get('[data-testid="library-contributions"]').find('[data-testid="library-link"]').first().click();
      cy.get('[data-cy=library-basis]').get('[data-testid="Username: pro badge"]');

      cy.step('On research pages');
      cy.visit(`/u/${subscriber.username}`);
      cy.get('[data-testid="research-contributions"]').find('[data-testid="research-link"]').first().click();
      cy.get('[data-testid="Username: pro badge"]');

      cy.step('On question pages');
      cy.visit('/questions/the-first-test-question');
      cy.get('[data-cy=question-body]').get('[data-testid="Username: pro badge"]');
      cy.get('[data-cy=comments-section]').get('[data-testid="Username: pro badge"]');
    });
  });
});
