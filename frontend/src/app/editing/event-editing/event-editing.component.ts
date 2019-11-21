import { Component, OnDestroy, ViewContainerRef } from '@angular/core';
import { Observable, Subscription, of } from 'rxjs';
import { map, catchError, take } from 'rxjs/operators';

import { Event, Person, Group } from 'src/app/interfaces';
import { PersonsGQL } from 'src/app/GraphQL/query-services/all-persons-gql.service';
import { UpdateEventGQL } from 'src/app/GraphQL/mutation-services/event/updateEvent-gql.service';
import { PopupService } from 'src/app/popup/popup.service';
import { DeleteEventGQL } from 'src/app/GraphQL/mutation-services/event/deleteEvent-gql.service';
import { NewEventGQL } from 'src/app/GraphQL/mutation-services/event/newEvent-gql.service';
import { EventsShallowGQL } from 'src/app/GraphQL/query-services/events/all-events-shallow-gql.service';
import { ActivatedRoute } from '@angular/router';
import { EventGQL } from 'src/app/GraphQL/query-services/events/event-gql.service';
import { GroupsForArticlesGQL } from './queries/groups-for-articles-gql.service';

@Component({
  selector: 'app-event-editing',
  templateUrl: './event-editing.component.html',
  styleUrls: ['./event-editing.component.scss']
})
export class EventEditingComponent implements OnDestroy {
  public persons: Observable<Person[]>;
  public groups: Observable<Group[]>;
  private selectedEvent: Event = {
    _id: undefined,
    authorityLevel: 1,
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
    private groupsGql: GroupsForArticlesGQL,
    private popServ: PopupService,
    private container: ViewContainerRef,
    private route: ActivatedRoute
  ) {
    this.groups = this.groupsGql.watch().valueChanges.pipe(
      map(el => el.data.groups),
      catchError(() => {
        this.popServ.flashPopup('could not load groups', this.container);
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
                .watch({ _id: params.get('id') })
                .valueChanges.pipe(take(1))
                .subscribe({
                  next: result =>
                    (this.selectedEvent = {
                      _id: result.data.event._id,
                      authorityLevel: result.data.event.authorityLevel,
                      description: result.data.event.description,
                      participants: result.data.event.participants,
                      title: result.data.event.title,
                      startDate: result.data.event.startDate,
                      endDate: result.data.event.endDate
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

  addGroup(selectedGroup: Group) {
    selectedGroup.members.forEach(member => {
      if (!this.selectedEvent.participants.find(participant => participant.person._id === member._id)) {
        // if member is not already participant
        this.selectedEvent.participants.push({ person: member, amount: undefined });
      }
    });
  }

  public saveEvent() {
    console.log(this.selectedEvent);
    const { _id, description, title, authorityLevel, startDate, endDate } = this.selectedEvent;
    // only return the id and amount of participants
    const participants = this.selectedEvent.participants.map(part => ({
      amount: part.amount,
      _id: part.person._id
    }));
    if (_id) {
      // update the event
      this.subs.push(
        this.updateEvGQL.mutate({ _id, description, title, authorityLevel, endDate, startDate, participants }).subscribe({
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
        this.newEvGql.mutate({ description, title, authorityLevel, endDate, startDate, participants }).subscribe({
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
