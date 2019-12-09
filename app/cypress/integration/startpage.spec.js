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
});
