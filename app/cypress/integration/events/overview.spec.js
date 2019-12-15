describe('the events page of the app', () => {

  beforeEach(() => {
    cy.fixture('events').as('events');
    cy.visit('/events');
  });

  // check if the articles with the demo data are there
  it('contains the event data', () => {
    cy.get('@events').then((events) => {
      events.forEach((event) => {
        cy.get('a').within(() => {
          cy.contains('h3', event.title);
          cy.contains('span', getDateString(event.start_date.$date));
          cy.contains('span', getDateString(event.end_date.$date));
          cy.contains('p', event.description);
        });
      });
    });
  });

  it('contains links to the event detail pages', () => {
    cy.get('@events').then((events) => {
      events.forEach((event) => {
        cy.contains('h3', event.title).click();
        cy.url().should('match', /events\/[a-f\d]{24}$/i);
      });
    });
  });
});

function getDateString(date) {
  date = new Date(date);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}
