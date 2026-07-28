import { FRIENDLY_MESSAGES } from 'oa-shared';

import { generateNewUserDetails } from '../utils/TestUtils';

describe('[Organisation sign-up]', () => {
  describe('[New organisation]', () => {
    it('Validate organisation sign-up form', () => {
      cy.visit('/sign-up/organisation');

      cy.step('Email is invalid');
      cy.get('[data-cy=email]').click();
      cy.get('[data-cy=email]').clear();
      cy.get('[data-cy=email]').type('a');
      cy.get('[data-cy=consent]').uncheck().check();
      cy.contains(FRIENDLY_MESSAGES['auth/invalid-email']).should('be.visible');

      cy.step('Password is too short');
      cy.get('[data-cy=password]').click();
      cy.get('[data-cy=password]').clear();
      cy.get('[data-cy=password]').type('a');
      cy.get('[data-cy=consent]').uncheck().check();
      cy.contains(FRIENDLY_MESSAGES['sign-up/password-short']).should('be.visible');
    });

    it('Renders the organisation sign-up entry page', () => {
      cy.visit('/sign-up');

      cy.step('Member sign-up links to organisation sign-up');
      cy.get('[data-cy=sign-up-organisation]').click();
      cy.url().should('include', '/sign-up/organisation');
      cy.get('[data-cy=Stepper]').should('be.visible');

      cy.step('The space profile-type badges render in the header');
      cy.get('[data-cy=organisation-signup-badges] [data-cy^="MemberBadge-"]').should(
        'have.length',
        4,
      );

      cy.step('The tenant-configured description + inline link are shown');
      cy.get('[data-cy=organisation-signup-description]').should(
        'contain',
        'Are you working with small-scale plastic recycling?',
      );
      cy.get('[data-cy=organisation-signup-description] a')
        .should('contain', 'our universe')
        .and('have.attr', 'href', '/academy');

      cy.step('The heads-up info box + Learn more link are shown');
      cy.contains('Heads up. After this you need to fill in some information.').should(
        'be.visible',
      );
      cy.get('[data-cy=organisation-signup-learn-more]')
        .should('contain', 'Learn more')
        .and('have.attr', 'href', '/academy');

      cy.step('Organisation sign-up links back to member sign-up');
      cy.get('[data-cy=sign-up-member]').click();
      cy.url().should('include', '/sign-up');
    });
  });

  describe('[Application flow]', () => {
    it('Completes the full organisation sign-up journey', () => {
      const user = generateNewUserDetails();
      const displayName = 'The Machine Shop';
      const description = 'We build machines for the local recycling network.';
      const website = 'https://machines.example.org';
      const profileType = 'machine-builder';

      cy.step('Create the organisation account (step 1)');
      cy.signUpNewOrganisation(user);

      cy.step('Lands on the verify-email message (step 2)');
      cy.url().should('include', 'sign-up-message');
      cy.get('[data-cy=Stepper]').should('be.visible');

      cy.step('The application form is gated until all mandatory fields are filled (step 3)');
      cy.visit('/organisation-application');
      cy.contains('One last step!').should('be.visible');
      cy.get('[data-cy=Stepper]').should('be.visible');
      cy.get('[data-cy=FocusSection]').should('contain', 'Check out our guidelines');
      cy.get('[data-cy=submit]').should('be.disabled');

      cy.step('Fill and submit the application');
      cy.fillOrganisationApplicationForm({
        profileType,
        username: user.username,
        displayName,
        description,
        website,
      });
      cy.get('[data-cy=submit]').click();

      cy.step('Lands on the newly created profile (visible to its owner)');
      cy.url().should('include', `/u/${user.username}`);
      cy.contains(displayName);
      cy.get(`[data-cy="MemberBadge-${profileType}"]`);

      cy.step('The owner sees the under-review banner');
      cy.get('[data-cy=organisation-moderation-banner]')
        .should('be.visible')
        .and('contain', 'being reviewed');

      cy.step('The new organisation profile is created awaiting moderation');
      cy.task('getProfileByUsername', user.username).then((profile) => {
        expect(profile, 'created profile row').to.be.an('object');
        expect((profile as { moderation: string }).moderation).to.eq('awaiting-moderation');
      });

      cy.step('The application form cannot be submitted twice');
      cy.visit('/organisation-application');
      cy.url().should('include', `/u/${user.username}`);

      cy.step('The profile is hidden from the public while under review');
      cy.logout();
      cy.visit(`/u/${user.username}`);
      cy.contains('User not found').should('be.visible');
      cy.contains(displayName).should('not.exist');
    });

    it('Lets an organisation change its focus from profile settings', () => {
      const user = generateNewUserDetails();
      const displayName = 'The Focus Org';

      cy.step('Create the organisation and submit its application as a Workspace');
      cy.signUpNewOrganisation(user);
      cy.fillOrganisationApplicationForm({
        profileType: 'workspace',
        username: user.username,
        displayName,
        description: 'We transform plastic waste into new products.',
        website: 'https://focus.example.org',
      });
      cy.get('[data-cy=submit]').click();
      cy.url().should('include', `/u/${user.username}`);

      cy.step('Open the profile settings');
      cy.visit('/settings/profile');
      cy.get('[data-cy=FocusSection]').should('be.visible');

      cy.step('The richer under-review notice and the global banner both show here');
      cy.get('[data-cy=organisation-moderation-details]')
        .should('be.visible')
        .and('contain', 'being reviewed');
      cy.get('[data-cy=organisation-moderation-banner]').should('be.visible');

      cy.step('The current focus is shown and the picker is hidden');
      cy.get('[data-cy=focus-current]')
        .should('contain', 'Workspace')
        .find('[data-cy="MemberBadge-workspace"]')
        .should('exist');
      cy.get('[data-cy=focus-save]').should('not.exist');

      cy.step('Change the focus to Machine Builder');
      cy.get('[data-cy=focus-change]').click();
      cy.get('[data-cy=machine-builder]').click();
      cy.get('[data-cy=focus-save]').click();

      cy.step('The success toast shows and the card reflects the new focus');
      cy.contains('Profile focus changed').should('be.visible');
      cy.get('[data-cy=focus-current]').should('contain', 'Machine Builder');
      cy.get('[data-cy=focus-save]').should('not.exist');

      cy.step('The new focus persists across a reload');
      cy.reload();
      cy.get('[data-cy=focus-current]').should('contain', 'Machine Builder');

      cy.step('Changing focus did not clear the moderation status');
      cy.task('getProfileByUsername', user.username).then((profile) => {
        expect((profile as { moderation: string }).moderation).to.eq('awaiting-moderation');
      });
    });

    it('Sign-in funnels an applicant back to the application form', () => {
      const user = generateNewUserDetails();

      cy.step('Sign up as an organisation but abandon the application');
      cy.signUpNewOrganisation(user);
      cy.logout();

      cy.step('Signing in redirects to the application form');
      cy.signIn(user.email, user.password);
      cy.url().should('include', '/organisation-application');

      cy.step('Settings also redirects to the application form');
      cy.visit('/settings');
      cy.url().should('include', '/organisation-application');
    });
  });
});
