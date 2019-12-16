describe('the startpage of the app', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // check basic contents of the page
  it('has the RöSeNa header', () => {
    cy.contains('h1', 'Röhlinger');
    cy.contains('h1', 'Sechtanarren');
    cy.contains('h3', 'e.V. 1970');
  });

  // check if upcoming event is on the page
  it('shows the next upcoming event and navigates to it', () => {
    cy.get('aside').contains('h3', /.*/);
    cy.get('aside').contains('p', /.*/).click();
    cy.url().should('include', '/events');
  });
});