describe('the nav-bar of the app', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigates to /events', () => {
    cy.get('a')
      .contains('Events')
      .click();
    cy.url().should('include', '/events');
  });

  it('navigates to /calendar', () => {
    cy.get('a')
      .contains('Kalender')
      .click();
    cy.url().should('include', '/calendar');
  });

  it('navigates to /edit', () => {
    cy.get('a')
      .contains('Bearbeiten')
      .click();
    cy.url().should('include', '/edit');
  });
});
