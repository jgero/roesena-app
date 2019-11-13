import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

import { Event, Person } from 'src/app/interfaces';
import { PersonsGQL } from 'src/app/GraphQL/query-services/all-persons-gql.service';
import { UpdateEventGQL } from 'src/app/GraphQL/mutation-services/event/updateEvent-gql.service';
import { PopupService } from 'src/app/popup/popup.service';
import { DeleteEventGQL } from 'src/app/GraphQL/mutation-services/event/deleteEvent-gql.service';
import { NewEventGQL } from 'src/app/GraphQL/mutation-services/event/newEvent-gql.service';
import { ListService } from '../list.service';
import { EventsShallowGQL } from 'src/app/GraphQL/query-services/events/all-events-shallow-gql.service';
import { ActivatedRoute } from '@angular/router';
import { EventGQL } from 'src/app/GraphQL/query-services/events/event-gql.service';

@Component({
  selector: 'app-event-editing',
  templateUrl: './event-editing.component.html',
  styleUrls: ['./event-editing.component.scss']
})
export class EventEditingComponent implements OnDestroy {
  public events: Observable<Event[]>;
  public persons: Observable<Person[]>;
  private selectedEvent: {
    _id: string;
    authorityGroup: number;
    description: string;
    endDate: string;
    startDate: string;
    participants: { person: Person; amount: number }[];
    title: string;
  } = {
    _id: undefined,
    authorityGroup: 1,
    description: '',
    endDate: undefined,
    startDate: undefined,
    participants: [],
    title: ''
  };

  private subs: Subscription[] = [];

  constructor(
    private eventsGQL: EventsShallowGQL,
    private eventGql: EventGQL,
    private personsGQL: PersonsGQL,
    private updateEvGQL: UpdateEventGQL,
    private newEvGql: NewEventGQL,
    private deleteEvGql: DeleteEventGQL,
    private popServ: PopupService,
    private container: ViewContainerRef,
    private listServ: ListService,
    private route: ActivatedRoute
  ) {
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
    this.subs.push(
      this.route.paramMap.subscribe({
        next: params => {
          const id = params.get('id');
          if (id) {
            this.subs.push(
              this.eventGql
                .watch({ _id: this.route.snapshot.params['id'] })
                .valueChanges.pipe(take(1))
                .subscribe({
                  next: result =>
                    (this.selectedEvent = {
                      _id: result.data.event._id,
                      authorityGroup: result.data.event.authorityGroup,
                      description: result.data.event.description,
                      participants: result.data.event.participants,
                      title: result.data.event.title,
                      startDate: this.toDateString(result.data.event.startDate),
                      endDate: this.toDateString(result.data.event.endDate)
                    }),
                  error: () => this.popServ.flashPopup('could not load event', this.container)
                })
            );
          }
        }
      })
    );
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
    const { _id, description, title, authorityGroup } = this.selectedEvent;
    // because of the binding to the input field these fields are acutally strings and have to be converted
    const startDate = this.toDateNumber(this.selectedEvent.startDate);
    const endDate = this.toDateNumber(this.selectedEvent.endDate);
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

  private toDateString(dateNumber: number): string {
    const year = dateNumber.toString().substr(0, 4);
    const month = dateNumber.toString().substr(4, 2);
    const day = dateNumber.toString().substr(6, 2);
    return `${day}.${month}.${year}`;
  }

  private toDateNumber(dateString: string): number {
    const parts = dateString.split('.');
    const year = parseInt(parts[2]);
    const month = parseInt(parts[1]);
    const day = parseInt(parts[0]);
    const m = month > 9 ? month : '0' + month;
    const d = day > 9 ? day : '0' + day;
    return parseInt(`${year}${m}${d}`, 10);
  }
}
