import { MOCK_DATA } from '../data';
import { generateNewUserDetails, getTenantUser } from '../utils/TestUtils';

const admin = getTenantUser(MOCK_DATA.users.admin);

describe('[Admin]', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // it('[Anonymous is redirected to sign-in]', () => {
    // cy.visit('/admin');
    // cy.url().should('include', '/sign-in');
  // });

  // it('[Regular user is redirected to forbidden]', () => {
    // const regularUser = generateNewUserDetails();
    // cy.signUpNewUser(regularUser);
    // cy.setProfileUsername(regularUser.username);

    // cy.visit('/admin');
    // cy.url().should('include', '/forbidden?page=admin');
    // cy.contains("You don't have the right permissions");
  // });

  // it('[Admin can access the admin panel]', () => {
    // cy.signIn(admin.email, admin.password);

    // cy.visit('/admin');
    // cy.url().should('include', '/admin/users');
    // cy.contains('Overview');
  // });

  // it('[Admin can access the admin questions overview]', () => {
    // cy.signIn(admin.email, admin.password)

    // cy.visit('/admin')
    // cy.get('a[href*="/admin/questions"]').click()
    // cy.url().should('include', '/admin/questions')
    // cy.get('h1').contains('Questions')
  // })

  // it('[Admin can click on the question title to go to the question page]', () => {
    // cy.signIn(admin.email, admin.password)

    // cy.visit('/admin')
    // cy.get('a[href*="/admin/questions"]').click()
    // cy.get('a[href*="/questions/"').first().click()
    // cy.url().should('include', '/questions/')

  // })

  // it('[Admin can click on the question author to go to the autors profile page]', () => {
    // cy.signIn(admin.email, admin.password)

    // cy.visit('/admin')
    // cy.get('a[href*="/admin/questions"]').click()
    // cy.get('a[href*="/u/"').first().click()
    // cy.url().should('include', '/u/')
  // })

  // it('[Admin can click on the edit button to go to the question edit page]', () => {
    // cy.signIn(admin.email, admin.password)

    // cy.visit('/admin')
    // cy.get('a[href*="/admin/questions"]').click()
    // cy.get('a[href*="/edit"').first().click()
    // cy.url().should('include', '/edit')
    // cy.contains('Edit your question to the community');
  // })

  // it('[When admin clicks on the delete button the confirmation dialog will show]', () => {
    // cy.signIn(admin.email, admin.password)

    // cy.visit('/admin/questions')
    // cy.wait(500)
    // cy.get('button[aria-label*="Delete"]').first().click({ force: true })
    // cy.contains('Delete Question')
    // cy.get('button').contains("Cancel").click({ force: true })
    // cy.get('body').should("not.contain.text", "Delete Question")
  // })


  // it('[Admin can delete questions from the question page]', () => {
    // cy.signIn(admin.email, admin.password)

    // cy.visit('/admin/questions')
    // cy.wait(500)
    // cy.get('button[aria-label*="Delete"]').first().click({ force: true })
    // cy.contains('Delete Question')
    // cy.get('button').contains("Delete").click({ force: true })
    // cy.get('body').should("not.contain.text", "Delete Question")
  // })

  it('[Admin can access the profile types page]', () => {
    cy.signIn(admin.email, admin.password)

    cy.visit('/admin')
    cy.get('a[href*="/admin/profile-types"]').click()
    cy.url().should('include', '/admin/profile-types')
    cy.get('h1').contains('Profile Types')
  })

  it('[Admin can add a new profile type]', () => {
  })
  // Test for adding a profile type
  // test for not being able to add a profile type if the form has empty fields
  // test for editing profile type
  // test for deleting unused profile type
  // test for not being able to delete used profile type
});

describe('[Admin - Profile Type', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.signIn(admin.email, admin.password)
  })
})