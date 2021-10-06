import { Component, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup, ValidatorFn } from '@angular/forms';
import { COMMA, ENTER, TAB } from '@angular/cdk/keycodes';
import { filter, takeUntil } from 'rxjs/operators';
import { cloneDeep } from 'lodash-es';

import { AppEvent, AppPerson, Participant } from 'src/app/utils/interfaces';
import { ChipsInputService } from '@services/chips-input.service';
import { ToLocalTimeStringPipe } from '@shared/converters/to-local-time/to-local-time-string.pipe';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { SubscriptionService } from '@services/subscription.service';
import { UpdateEvent, CreateEvent, DeleteEvent, LoadSingleEvent } from '@state/events';
import { MatDialog } from '@angular/material/dialog';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { DeleteConfirmPopupComponent } from '@shared/delete-confirm/delete-confirm-popup/delete-confirm-popup.component';
import { CookieService } from 'ngx-cookie-service';
import { UsageHintPopupComponent } from '@shared/usage-hints/usage-hint-popup/usage-hint-popup.component';
import { SeoService } from '@services/seo.service';
import { AutocompleteService } from '@services/autocomplete.service';
import { LoadPersons } from '@state/persons';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class EditorComponent implements OnDestroy {
  contentFormGroup: FormGroup;
  dateFormGroup: FormGroup;
  participantsFormGroup: FormGroup;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA, TAB];
  event: AppEvent;
  persons: AppPerson[];
  groups: string[] = [];
  isLoading$ = this.store.select('events', 'isLoading');
  get canSave(): boolean {
    if (!this.contentFormGroup || !this.dateFormGroup || !this.participantsFormGroup) {
      return false;
    }
    // user can save if everything is valid ...
    return (
      this.contentFormGroup.valid &&
      this.dateFormGroup.valid &&
      this.participantsFormGroup.valid &&
      // ... and something has changed when editing existing events
      (this.contentFormGroup.dirty || this.dateFormGroup.dirty || this.participantsFormGroup.dirty)
    );
  }

  constructor(
    public chips: ChipsInputService,
    private store: Store<State>,
    private subs: SubscriptionService,
    private dialog: MatDialog,
    seo: SeoService,
    private cookies: CookieService,
    public autocomplete: AutocompleteService
  ) {
    // dispatch the action to load the event that should be edited
    this.store.dispatch(new LoadSingleEvent());
    // dispatch the event to load the persons who can be invited
    this.store.dispatch(new LoadPersons({ limit: 400 }));
    // init event and it's form when event is loaded
    this.store
      .select('events', 'activeEvent')
      .pipe(
        filter((event) => event !== null),
        takeUntil(this.subs.unsubscribe$)
      )
      .subscribe({
        next: (event) => {
          seo.setTags(
            `Bearbeiten: ${event.title}`,
            event.description.substring(0, 30).concat('...'),
            undefined,
            `/events/edit/${event.id}`
          );
          // deep copy the object
          this.event = cloneDeep(event);
          const p = new ToLocalTimeStringPipe();
          this.contentFormGroup = new FormGroup({
            title: new FormControl(this.event.title, [Validators.required]),
            description: new FormControl(this.event.description, []),
            tags: new FormControl(this.event.tags),
          });
          this.dateFormGroup = new FormGroup({
            date: new FormControl(this.event.date, [Validators.required]),
            time: new FormControl(p.transform(this.event.date), [
              Validators.required,
              Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$'),
            ]),
          });
          this.participantsFormGroup = new FormGroup(
            {
              deadlineDate: new FormControl(this.event.deadline),
              deadlineTime: new FormControl(this.event.deadline ? p.transform(this.event.deadline) : '', [
                Validators.pattern('^([01][0-9]|2[0-3]):([0-5][0-9])$'),
              ]),
              participants: new FormControl(this.event.participants),
            },
            [this.getDeadlineFormValidatorFn()]
          );
        },
      });

    // init persons and the groups on load
    this.store
      .select('persons', 'persons')
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe({
        next: (persons) => {
          this.groups = [];
          // deep copy the object
          this.persons = cloneDeep(persons);
          persons.forEach((person) => {
            person.groups.forEach((group) => {
              if (!this.groups.includes(group)) {
                this.groups.push(group);
              }
            });
          });
          // also add the special group 'alle' to target everyone
		  this.groups.push('alle');
        },
      });

    // handle loading state
    this.store
      .select('events', 'isLoading')
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe({
        next: (isLoading) => {
          if (!this.contentFormGroup || !this.dateFormGroup || !this.participantsFormGroup) {
            return;
          }
          if (isLoading) {
            this.contentFormGroup.disable();
            this.dateFormGroup.disable();
            this.participantsFormGroup.disable();
          } else {
            this.contentFormGroup.enable();
            this.contentFormGroup.markAsPristine();
            this.dateFormGroup.enable();
            this.dateFormGroup.markAsPristine();
            this.participantsFormGroup.enable();
            this.participantsFormGroup.markAsPristine();
          }
        },
      });
  }

  onAddGroup(group: string) {
    const formEl = this.participantsFormGroup.get('participants');
    // search for all persons that are in the group or add everyone if 'alle' was clicked
    this.persons
      .filter((person) => person.groups.includes(group) || group === 'alle')
      .forEach((person) => {
        const { id, name } = person;
        // add the person if it is not already a participant
        if (!(formEl.value as Participant[]).find((el) => el.id === id)) {
          formEl.setValue([...formEl.value, { name, amount: -1, id, hasUnseenChanges: true }]);
          formEl.markAsDirty();
        }
      });
  }

  onRemoveGroup(group: string) {
    const formEl = this.participantsFormGroup.get('participants');
    // search for all persons that are in the group or remove everyone if 'alle' was clicked
    this.persons
      .filter((person) => person.groups.includes(group) || group === 'alle')
      .forEach((person) => {
        // remove the person if it is a participant
        if ((formEl.value as Participant[]).find((el) => el.id === person.id)) {
          // keep all persons, which do not have the id of the person that should be removed
          formEl.setValue([...(formEl.value as Participant[]).filter((el) => el.id !== person.id)]);
          formEl.markAsDirty();
        }
      });
  }

  onSubmit() {
    // if cookie is set save directly, otherwise force user to accept
    if (this.cookies.check('UsageAgreementAccepted')) {
      this.saveEvent();
    } else {
      this.dialog
        .open(UsageHintPopupComponent)
        .afterClosed()
        .pipe(takeUntil(this.subs.unsubscribe$))
        .subscribe((result) => {
          // only act if the user has accepted the usage hints
          if (result) {
            this.saveEvent();
          }
        });
    }
  }

  private saveEvent() {
    const updated: AppEvent = {
      id: this.event.id,
      ownerId: this.event.ownerId,
      ownerName: this.event.ownerName,
      title: this.contentFormGroup.get('title').value,
      description: this.contentFormGroup.get('description').value,
      tags: this.contentFormGroup.get('tags').value,
      date: this.getDateFromDateAndTimeStrings(this.dateFormGroup.get('date').value, this.dateFormGroup.get('time').value),
      deadline: this.getDateFromDateAndTimeStrings(
        this.participantsFormGroup.get('deadlineDate').value,
        this.participantsFormGroup.get('deadlineTime').value
      ),
      // not only add the participants, but also set the unseen changes for all to true
      participants: (this.participantsFormGroup.get('participants').value as Participant[]).map((participant) => {
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
      .open(DeleteConfirmPopupComponent, { data: { title: 'Sicher?' } })
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

  addPerson(person: AppPerson) {
    const { id, name } = person;
    const formEl = this.participantsFormGroup.get('participants');
    formEl.setValue([...(formEl.value as Participant[]), { id, amount: -1, name, hasUnseenChanges: true }]);
    formEl.markAsDirty();
  }

  removePerson(person: Participant) {
    const formEl = this.participantsFormGroup.get('participants');
    formEl.setValue([...(formEl.value as Participant[]).filter((el) => el.id !== person.id)]);
    formEl.markAsDirty();
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
