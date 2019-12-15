describe('the events page of the app', () => {
  before('load example data of fixtures that is also saved in databse', () => {
    cy.fixture('events').as('events');
  })

  beforeEach(() => {
    cy.visit('/events');
  });

  // check if the articles with the demo data are there
  it('contains the event data', () => {
    cy.get('@events').then((events) => {
      events.forEach((event) => {
        cy.get('a').within(() => {
          cy.get('h3').contains(event.title);
          cy.get('span').contains(getDateString(event.start_date.$date));
          cy.get('span').contains(getDateString(event.end_date.$date));
          cy.get('p').contains(event.description);
        });
      });
    });
  });
});

function getDateString(date) {
  date = new Date(date);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}
