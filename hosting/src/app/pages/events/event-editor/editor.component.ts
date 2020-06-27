import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators, FormGroup, AbstractControl, ValidatorFn } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Subscription } from 'rxjs';
import { tap, map, filter, take, takeUntil } from 'rxjs/operators';

import { AppEvent, AppPerson, Participant } from 'src/app/utils/interfaces';
import { ChipsInputService } from 'src/app/services/chips-input.service';
import { ToLocalTimeStringPipe } from 'src/app/shared/converters/to-local-time/to-local-time-string.pipe';
import { Store } from '@ngrx/store';
import { State } from '@state/events/editor/reducers/event.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { LoadEvent } from '@state/events/actions/event.actions';
import { LoadPersons, UpdateEvent, CreateEvent, DeleteEvent } from '@state/events/editor/actions/event.actions';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnDestroy {
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  event: AppEvent;
  eventForm: FormGroup;
  persons: AppPerson[];
  groups: string[] = [];

  constructor(
    public chips: ChipsInputService,
    private store: Store<State>,
    private subs: SubscriptionService,
    private dialog: MatDialog
  ) {
    // dispatch the event to load the event that should be edited
    this.store.dispatch(new LoadEvent());
    // dispatch the event to load the persons who can be invited
    this.store.dispatch(new LoadPersons());
    // init event and it's form when event is loaded
    this.store
      .select('events', 'event')
      .pipe(
        filter((event) => event !== null),
        take(1),
        takeUntil(this.subs.unsubscribe$)
      )
      .subscribe({
        next: (event) => {
          // deep copy the object
          this.event = JSON.parse(JSON.stringify(event));
          this.event.startDate = new Date(this.event.startDate);
          this.event.endDate = new Date(this.event.endDate);
          this.event.deadline = new Date(this.event.deadline);
          const p = new ToLocalTimeStringPipe();
          this.eventForm = new FormGroup({
            title: new FormControl(this.event.title, [Validators.required]),
            description: new FormControl(this.event.description, []),
            startDate: new FormControl(this.event.startDate, [Validators.required]),
            startTime: new FormControl(p.transform(this.event.startDate), [
              Validators.required,
              Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$'),
            ]),
            endDate: new FormControl(this.event.endDate, [Validators.required]),
            endTime: new FormControl(p.transform(this.event.endDate), [
              Validators.required,
              Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$'),
            ]),
            tags: new FormControl(this.event.tags),
            deadline: new FormGroup(
              {
                deadlineDate: new FormControl(this.event.deadline),
                deadlineTime: new FormControl(this.event.deadline ? p.transform(this.event.deadline) : '', [
                  Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$'),
                ]),
                participants: new FormControl(this.event.participants),
              },
              [this.getDeadlineFormValidatorFn()]
            ),
          });
        },
      });

    // init persons and the groups on load
    this.store
      .select('eventEditor', 'persons')
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe({
        next: (persons) => {
          // deep copy the object
          this.persons = JSON.parse(JSON.stringify(persons));
          // this.persons = [] as any;
          // Object.assign(this.persons, persons);
          // console.log(persons);
          persons.forEach((person) => {
            person.groups.forEach((group) => {
              if (!this.groups.includes(group)) {
                this.groups.push(group);
              }
            });
          });
        },
      });

    // handle loading state
    this.store
      .select('eventEditor', 'isLoading')
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe({
        next: (isLoading) => {
          if (!this.eventForm) {
            return;
          }
          if (isLoading) {
            this.eventForm.disable();
          } else {
            this.eventForm.enable();
            this.eventForm.markAsPristine();
          }
        },
      });
  }

  onAddGroup(group: string) {
    this.persons
      .filter((person) => person.groups.includes(group))
      .forEach((person) => {
        const id = person.id;
        const index = (this.eventForm.get('deadline').get('participants').value as Participant[]).findIndex(
          (part) => part.id === id
        );
        if (index < 0) {
          // add the person as participant
          (this.eventForm.get('deadline').get('participants').value as Participant[]).push({
            id,
            amount: -1,
            name: person.name,
            hasUnseenChanges: true,
          });
        }
      });
    // manually run the validity check after a person was clicked
    this.eventForm.get('deadline').get('participants').updateValueAndValidity();
    this.eventForm.get('deadline').get('participants').markAsDirty();
  }

  onRemoveGroup(group: string) {
    this.persons
      .filter((person) => person.groups.includes(group))
      .forEach((person) => {
        const id = person.id;
        const index = (this.eventForm.get('deadline').get('participants').value as Participant[]).findIndex(
          (part) => part.id === id
        );
        if (index >= 0) {
          // remove the participant from the array of participants
          (this.eventForm.get('deadline').get('participants').value as Participant[]).splice(index, 1);
        }
      });
    // manually run the validity check after a person was clicked
    this.eventForm.get('deadline').get('participants').updateValueAndValidity();
    this.eventForm.get('deadline').get('participants').markAsDirty();
  }

  onSubmit() {
    const updated: AppEvent = {
      id: this.event.id,
      ownerId: this.event.ownerId,
      ownerName: this.event.ownerName,
      title: this.eventForm.get('title').value,
      description: this.eventForm.get('description').value,
      tags: this.eventForm.get('tags').value,
      startDate: this.getDateFromDateAndTimeStrings(this.eventForm.get('startDate').value, this.eventForm.get('startTime').value),
      endDate: this.getDateFromDateAndTimeStrings(this.eventForm.get('endDate').value, this.eventForm.get('endTime').value),
      deadline: this.getDateFromDateAndTimeStrings(
        this.eventForm.get('deadline').get('deadlineDate').value,
        this.eventForm.get('deadline').get('deadlineTime').value
      ),
      // not only add the participants, but also set the unseen changes for all to true
      participants: (this.eventForm.get('deadline').get('participants').value as Participant[]).map((participant) => {
        const el: any = {};
        Object.assign(el, participant);
        el.hasUnseenChanges = true;
        return participant;
      }),
    };
    if (this.event.id) {
      this.store.dispatch(new UpdateEvent({ event: updated }));
    } else {
      this.store.dispatch(new CreateEvent({ event: updated }));
    }
  }

  deleteEvent(): void {
    this.dialog
      .open(DeleteDialogComponent)
      .afterClosed()
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.store.dispatch(new DeleteEvent());
        }
      });
  }

  private getDateFromDateAndTimeStrings(d: Date, time: string): Date {
    if (!d || !time) {
      return null;
    }
    const nparts: number[] = time.split(':').map((el) => parseInt(el, 10));
    d.setHours(nparts[0], nparts[1]);
    return d;
  }

  getDeadlineFormValidatorFn(): ValidatorFn {
    return (g: FormGroup) => {
      const date = g.get('deadlineDate').value;
      const time = g.get('deadlineTime').value;
      const participantCount = g.get('participants').value.length;
      // invalid if any of the children are invalid
      if (g.get('deadlineDate').invalid || g.get('deadlineTime').invalid || g.get('participants').invalid) {
        return { pattern: true };
      }
      // valid if everything is empty
      if (!date && !time && participantCount === 0) {
        return null;
      }
      // invalid if either time or date or both are missing
      if ((date && !time) || (!date && time) || (!date && !time)) {
        return { dateAndTime: true };
      }
      // invalid if participants are missing
      if (g.get('participants').value.length === 0) {
        return { participantsMissing: true };
      }
      return null;
    };
  }

  isPersonSelected(id: string): boolean {
    return !!(this.eventForm.get('deadline').get('participants').value as Participant[]).find((part) => part.id === id);
  }

  onPersonClick(id: string) {
    const index = (this.eventForm.get('deadline').get('participants').value as Participant[]).findIndex((part) => part.id === id);
    if (index < 0) {
      // add the person as participant
      (this.eventForm.get('deadline').get('participants').value as Participant[]).push({
        id,
        amount: -1,
        name: this.persons.find((p) => p.id === id).name,
        hasUnseenChanges: true,
      });
    } else {
      // remove the participant from the array of participants
      (this.eventForm.get('deadline').get('participants').value as Participant[]).splice(index, 1);
    }
    // manually run the validity check after a person was clicked
    this.eventForm.get('deadline').get('participants').updateValueAndValidity();
    this.eventForm.get('deadline').get('participants').markAsDirty();
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}

@Component({
  selector: 'delete-dialog',
  templateUrl: 'delete-dialog.html',
})
export class DeleteDialogComponent {}
