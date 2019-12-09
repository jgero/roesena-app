describe('the footer of the app', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('navigates to page of Wildes Heer', () => {
    cy.get('a').contains('Das Wilde Heer');
  });

  it('navigates to page of stones', () => {
    cy.get('a').contains('Röhling Stones');
  });

  it('navigates to page of Brandjoggala', () => {
    cy.get('a').contains('Brandjoggala');
  });

  it('has info about page owner', () => {
    cy.get('p')
      .contains('Faschingsgesellschaft')
      .contains('Röhlinger')
      .contains('Sechtanarren')
      .contains('Max Mustermann')
      .contains('Musterstraße 12')
      .contains('12345 Musterstadt')
      .contains('info@mustermail.com');
  });

  it('navigates to /about', () => {
    cy.get('a')
      .contains('Impressum')
      .click();
    cy.url().should('include', '/about');
  });

  it('navigates to /references', () => {
    cy.get('a')
      .contains('Links')
      .click();
    cy.url().should('include', '/references');
  });

  it('navigates to /press', () => {
    cy.get('a')
      .contains('Presse')
      .click();
    cy.url().should('include', '/press');
  });

  it('navigates to /help', () => {
    cy.get('a')
      .contains('Hilfe')
      .click();
    cy.url().should('include', '/help');
  });
});
