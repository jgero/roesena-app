import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Event, Person, EventUpdate } from 'src/app/interfaces';
import { EventsGQL } from 'src/app/GraphQL/query-services/all-events-gql.service';
import { PersonsGQL } from 'src/app/GraphQL/query-services/all-persons-gql.service';
import { UpdateEventGQL } from 'src/app/GraphQL/mutation-services/updateEvent-gql.service';

@Component({
  selector: 'app-event-editing',
  templateUrl: './event-editing.component.html',
  styleUrls: ['./event-editing.component.scss']
})
export class EventEditingComponent implements OnDestroy {

  public events: Observable<Event[]>;
  public persons: Observable<Person[]>;
  public selectedEvent: Event;

  private subs: Subscription[] = [];

  constructor(
    eventsGQL: EventsGQL,
    personsGQL: PersonsGQL,
    private updateEvGQL: UpdateEventGQL
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

  public updateEvent(event: EventUpdate) {
    console.log(event);

    this.subs.push(this.updateEvGQL.mutate({ ...event }).subscribe({
      error: () => console.log("error"),
      complete: () => console.log("done")
    }));
    // this.http.put(`/api/event?id=${id}`, event).subscribe({
    //   next: () => console.log('saved!')
    // });
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
