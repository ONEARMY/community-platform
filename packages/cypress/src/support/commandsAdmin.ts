export {};

type AdminAction = 'Edit' | 'Delete' | 'Disable' | 'Enable';

declare global {
  namespace Cypress {
    interface Chainable {
      adminAction(action: AdminAction, name: string): Chainable<void>;
      expectActionBlocked(name: string, reason: string): Chainable<void>;
      confirmDialog(): Chainable<void>;
      saveDialog(): Chainable<void>;
      expectFormError(error: string): Chainable<void>;
      expectFieldError(field: string): Chainable<void>;
    }
  }
}

const quiet = { log: false };

const DIALOG = '[data-slot=dialog-content]';
const DIALOG_FOOTER_BUTTONS = `${DIALOG} [data-slot=dialog-footer] button`;
const DIALOG_SUBMIT_BUTTON = `${DIALOG} button[type=submit]`;
const DIALOG_LABELS = `${DIALOG} label`;
const TOAST_MESSAGE = '[data-cy=toast-message]';

const logStep = (displayName: string, message: string) => {
  Cypress.log({ displayName, message });
};

const hasLabel = (label: string) => (_: number, element: HTMLElement) =>
  element.getAttribute('aria-label') === label;

const hasText = (text: string) => (_: number, element: HTMLElement) =>
  element.innerText.trim() === text;

const isNotCancel = (_: number, element: HTMLElement) => element.innerText.trim() !== 'Cancel';

const findByLabel = (label: string) => cy.get('[aria-label]', quiet).filter(hasLabel(label), quiet);

const clickOnly = (elements: Cypress.Chainable<JQuery<HTMLElement>>) => {
  elements.should('have.length', 1).click(quiet);
};

Cypress.Commands.add('adminAction', (action: AdminAction, name: string) => {
  logStep('adminAction', `Click "${action}" on: ${name}`);

  clickOnly(findByLabel(`${action} ${name}`));
});

Cypress.Commands.add('expectActionBlocked', (name: string, reason: string) => {
  logStep('expectActionBlocked', `Expect "${name}" can't be deleted: ${reason}`);

  findByLabel(`Delete ${name}`).should('not.exist');
  clickOnly(findByLabel(`Can't delete ${name}`));
  cy.expectToast(reason);
});

Cypress.Commands.add('confirmDialog', () => {
  logStep('confirmDialog', 'Confirm dialog');

  clickOnly(cy.get(DIALOG_FOOTER_BUTTONS, quiet).filter(isNotCancel, quiet));
});

Cypress.Commands.add('saveDialog', () => {
  logStep('saveDialog', 'Save dialog');

  clickOnly(cy.get(DIALOG_SUBMIT_BUTTON, quiet));
});

Cypress.Commands.add('expectFormError', (error: string) => {
  logStep('expectFormError', `Expect form error: ${error}`);

  cy.get(DIALOG, quiet).should('be.visible');
  cy.contains(`${DIALOG}, ${TOAST_MESSAGE}`, error, quiet).should('be.visible');
});

Cypress.Commands.add('expectFieldError', (field: string) => {
  logStep('expectFieldError', `Expect form error on field: ${field}`);

  cy.get(DIALOG, quiet).should('be.visible');
  cy.get(DIALOG_LABELS, quiet)
    .filter(hasText(field), quiet)
    .should('have.length', 1)
    .invoke(quiet, 'attr', 'for')
    .then((inputId) => {
      expect(inputId, `"for" attribute on label "${field}"`).to.be.a('string').and.not.be.empty;

      cy.get('body', quiet).should(($body) => {
        const input = $body.find(`#${CSS.escape(inputId as string)}`);
        const isInvalid = input.is(':invalid, [aria-invalid=true]');

        expect(input, `input for label "${field}"`).to.have.length(1);
        expect(isInvalid, `input for label "${field}" is invalid`).to.equal(true);
      });
    });
});
