import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Event, Person } from 'src/app/interfaces';
import { EventsGQL } from 'src/app/GraphQL/query-services/all-events-gql.service';
import { PersonsGQL } from 'src/app/GraphQL/query-services/all-persons-gql.service';

@Component({
  selector: 'app-event-editing',
  templateUrl: './event-editing.component.html',
  styleUrls: ['./event-editing.component.scss']
})
export class EventEditingComponent {

  public events: Observable<Event[]>;
  public persons: Observable<Person[]>;

  public selectedEvent: Event;

  constructor(
    eventsGQL: EventsGQL,
    personsGQL: PersonsGQL
  ) {
    this.events = eventsGQL.watch().valueChanges.pipe(
      map(el => el.data.events)
    );
    this.persons = personsGQL.watch().valueChanges.pipe(
      map(el => el.data.persons)
    );
  }

  public toggleID(id: string) {
    if (!this.selectedEvent.participants) {
      // if no array exist create one with the id
      this.selectedEvent.participants = [id];
    } else if (this.selectedEvent.participants.includes(id)) {
      // if its already in the array remove it
      this.selectedEvent.participants.splice(this.selectedEvent.participants.findIndex(el => el === id), 1);
    } else {
      // else add it
      this.selectedEvent.participants.push(id);
    }
  }

  public saveEvent(event: Event) {
    console.log(event);
    // const id = event._id;
    // delete event._id;
    // this.http.put(`/api/event?id=${id}`, event).subscribe({
    //   next: () => console.log('saved!')
    // });
  }

}
