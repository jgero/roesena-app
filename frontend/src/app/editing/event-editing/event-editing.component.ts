import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Event, Person } from 'src/app/interfaces';
import { PersonsGQL } from 'src/app/GraphQL/query-services/all-persons-gql.service';
import { UpdateEventGQL } from 'src/app/GraphQL/mutation-services/event/updateEvent-gql.service';
import { PopupService } from 'src/app/popup/popup.service';
import { DeleteEventGQL } from 'src/app/GraphQL/mutation-services/event/deleteEvent-gql.service';
import { NewEventGQL } from 'src/app/GraphQL/mutation-services/event/newEvent-gql.service';
import { ListService } from '../list.service';
import { EventsShallowGQL } from 'src/app/GraphQL/query-services/events/all-events-shallow-gql.service';
import { ActivatedRoute } from '@angular/router';

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
    private eventsGQL: EventsShallowGQL,
    private personsGQL: PersonsGQL,
    private updateEvGQL: UpdateEventGQL,
    private newEvGql: NewEventGQL,
    private deleteEvGql: DeleteEventGQL,
    private popServ: PopupService,
    private container: ViewContainerRef,
    private listServ: ListService,
    private route: ActivatedRoute
  ) {
    console.log(route.snapshot.params);
    this.listServ.list = this.eventsGQL.watch().valueChanges.pipe(
      map(el => el.data.events.map(el => ({ _id: el._id, value: el.title }))),
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
    // request the event from the route id here
    // this will then be the selected event
    // if no id is in route new event has to be created
  }

  public isParticipant(id: string): boolean {
    const res = !!this.selectedEvent.participants.find(part => part.person._id === id);
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

  public deleteEvent() {
    const id = this.selectedEvent._id;
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
