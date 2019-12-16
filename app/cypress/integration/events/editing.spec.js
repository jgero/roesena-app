describe('CRUD for events, ', () => {

  beforeEach(() => {
    cy.fixture('events').as('events');
    cy.visit('/edit');
  });

  // check if the event list exists
  it('all events from the db get loaded into list on root edit page initially', () => {
    cy.get('@events').then(events => {
      cy.get('li').contains('Events');
      events.forEach(event => {
        cy.get('ul').within(() => {
          cy.get('a').contains(event.title).click();
          cy.url().should('match', /edit\/events\/[a-f\d]{24}$/i);
        });
      });
    });
  });

  // check if deleted event does not exist in list afterwards
  it('events get removed from list when deleted by button click and do not reappear on reload', () => {
    cy.get('@events').then(events => {
      // save the id of the event that will be deleted
      cy.contains('a', events[0].title)
        .parent().contains('button', '-').click();
      cy.contains('a', events[0].title).should('not.exist');
      // reload the page and it should still not be there
      cy.visit('/edit');
      cy.contains('a', events[0].title).should('not.exist');
    });
  });

  it('events can be created by using the event form and then appear in list in root edit page', () => {
    cy.get('@events').then(events => {
      // navigate to the page to add new event
      cy.visit('/edit/events');
      cy.get('#title').type(events[0].title);
      cy.get('#description').type(events[0].description);
      cy.get('#start_date').type(getDateString(events[0].start_date.$date));
      cy.get('#end_date').type(getDateString(events[0].end_date.$date));
      cy.get('#auth_lvl').type(events[0].auth_lvl);
      cy.get('form').submit();

      // go back to main edit page and check for event in the list
      cy.visit('/edit');
      cy.get('ul').within(() => {
        cy.get('a').contains(events[0].title).click();
        cy.url().should('match', /edit\/events\/[a-f\d]{24}$/i);
      });
    });
  });

  it('updates in the events get saved and are visible in the list of the main editing page', () => {
    cy.get('@events').then(events => {
      // click on the first element in the list
      cy.get('a').contains(events[0].title).click();
      // change the title and submit
      cy.get('#title').type('test');
      cy.get('form').submit();
      // go back to main edit page and check if the title now appears in the list, then click the link again
      cy.visit('/edit');
      cy.get('a').contains('test').click();
      // change the title back to the original value
      cy.get('#title').type(events[0].title);
      cy.get('form').submit();
      // go back to the list and check again
      cy.visit('/edit');
      cy.get('a').contains(events[0].title);
    });
  });
});

function getDateString(date) {
  date = new Date(date);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}
