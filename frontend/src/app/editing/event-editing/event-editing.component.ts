import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Event, Person } from 'src/app/interfaces';
import { EventsGQL } from 'src/app/GraphQL/query-services/all-events-gql.service';
import { PersonsGQL } from 'src/app/GraphQL/query-services/all-persons-gql.service';
import { UpdateEventGQL } from 'src/app/GraphQL/mutation-services/event/updateEvent-gql.service';
import { PopupService } from 'src/app/popup/popup.service';
import { DeleteEventGQL } from 'src/app/GraphQL/mutation-services/event/deleteEvent-gql.service';
import { NewEventGQL } from 'src/app/GraphQL/mutation-services/event/newEvent-gql.service';

@Component({
  selector: 'app-event-editing',
  templateUrl: './event-editing.component.html',
  styleUrls: ['./event-editing.component.scss']
})
export class EventEditingComponent implements OnDestroy {
  public events: Observable<Event[]>;
  public persons: Observable<Person[]>;
  public selectedEvent: Event = {
    _id: undefined,
    authorityGroup: 1,
    description: '',
    endDate: 0,
    startDate: 0,
    participants: [],
    title: ''
  };

  private subs: Subscription[] = [];

  constructor(
    private eventsGQL: EventsGQL,
    private personsGQL: PersonsGQL,
    private updateEvGQL: UpdateEventGQL,
    private newEvGql: NewEventGQL,
    private deleteEvGql: DeleteEventGQL,
    private popServ: PopupService,
    private container: ViewContainerRef
  ) {
    this.events = this.eventsGQL.watch().valueChanges.pipe(
      map(el => el.data.events),
      catchError(() => {
        this.popServ.flashPopup('could not load events', this.container);
        return of([]);
      })
    );
    this.persons = this.personsGQL.watch().valueChanges.pipe(
      map(el => el.data.persons),
      catchError(() => {
        this.popServ.flashPopup('could not load persons', this.container);
        return of([]);
      })
    );
  }

  public selectEvent(newEv?: Event) {
    if (newEv) {
      Object.assign(this.selectedEvent, newEv);
    } else {
      this.selectedEvent = {
        _id: undefined,
        authorityGroup: 1,
        description: '',
        endDate: 0,
        startDate: 0,
        participants: [],
        title: ''
      };
    }
  }

  public isParticipant(id: string): boolean {
    console.log(id, this.selectedEvent.participants);
    const res = !!this.selectedEvent.participants.find(part => part.person._id === id);
    console.log(res);
    return res;
  }

  public togglePerson(pers: Person) {
    if (!!this.selectedEvent.participants.find(part => part.person._id === pers._id)) {
      // if its already in the array remove it
      this.selectedEvent.participants = this.selectedEvent.participants.filter(part => part.person._id !== pers._id);
    } else {
      // else add it
      this.selectedEvent.participants.push({ person: pers, amount: undefined });
    }
  }

  public saveEvent() {
    const { _id, description, title } = this.selectedEvent;
    // because of the binding to the input field these fields are acutally strings and have to be converted
    const authorityGroup = parseInt(this.selectedEvent.authorityGroup as any, 10);
    const startDate = parseInt(this.selectedEvent.startDate as any, 10);
    const endDate = parseInt(this.selectedEvent.endDate as any, 10);
    // only return the id and amount of participants
    const participants = this.selectedEvent.participants.map(part => ({
      amount: part.amount,
      _id: part.person._id
    }));
    if (_id) {
      // update the event
      this.subs.push(
        this.updateEvGQL.mutate({ _id, description, title, authorityGroup, endDate, startDate, participants }).subscribe({
          next: () => this.popServ.flashPopup('Event bearbeitet', this.container),
          error: () => this.popServ.flashPopup('Bearbeiten fehlgeschlagen', this.container),
          complete: () => {
            // refetch the articles, will cause the articles Observable to emit the new values
            this.eventsGQL.watch().refetch();
          }
        })
      );
    } else {
      // create a new event
      this.subs.push(
        this.newEvGql.mutate({ description, title, authorityGroup, endDate, startDate, participants }).subscribe({
          next: () => this.popServ.flashPopup('Event erstellt', this.container),
          error: () => this.popServ.flashPopup('Erstellen fehlgeschlagen', this.container),
          complete: () => {
            // refetch the articles, will cause the articles Observable to emit the new values
            this.eventsGQL.watch().refetch();
          }
        })
      );
    }
  }

  public deleteEvent(id: string) {
    this.subs.push(
      this.deleteEvGql.mutate({ _id: id }).subscribe({
        next: () => this.popServ.flashPopup('Event gelöscht', this.container),
        error: () => this.popServ.flashPopup('Löschen fehlgeschlagen', this.container),
        complete: () => {
          // refetch the articles, will cause the articles Observable to emit the new values
          this.eventsGQL.watch().refetch();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
