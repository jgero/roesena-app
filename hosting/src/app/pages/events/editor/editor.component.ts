import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, Validators, FormGroup, AbstractControl, ValidatorFn } from "@angular/forms";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";

import { appEvent, appPerson, Participant } from "src/app/utils/interfaces";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { ChipsInputService } from "src/app/services/chips-input.service";
import { ToLocalTimeStringPipe } from "src/app/shared/converters/to-local-time/to-local-time-string.pipe";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnDestroy {
  readonly initEvent: appEvent;
  readonly persons: appPerson[];
  groups: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  eventForm: FormGroup;
  private subs: Subscription[] = [];

  constructor(
    private eventDAO: EventDALService,
    route: ActivatedRoute,
    private auth: AuthService,
    private router: Router,
    public chips: ChipsInputService
  ) {
    // get persons from route data
    this.persons = route.snapshot.data.persons;
    // build groups from person data
    this.persons.forEach((person) => {
      person.groups.forEach((group) => {
        if (!this.groups.includes(group)) {
          this.groups.push(group);
        }
      });
    });
    // get the event from the route
    this.initEvent = route.snapshot.data.event;
    // build the form element
    const p = new ToLocalTimeStringPipe();
    this.eventForm = new FormGroup({
      title: new FormControl(this.initEvent.title, [Validators.required]),
      description: new FormControl(this.initEvent.description, []),
      startDate: new FormControl(this.initEvent.startDate, [Validators.required]),
      startTime: new FormControl(
        p.transform(this.initEvent.startDate),
        [Validators.required, Validators.pattern("^([01][0-9]|2[0-3]):([0-5][0-9])$")]
      ),
      endDate: new FormControl(this.initEvent.endDate, [Validators.required]),
      endTime: new FormControl(
        p.transform(this.initEvent.endDate),
        [Validators.required, Validators.pattern("^([01][0-9]|2[0-3]):([0-5][0-9])$")]
      ),
      tags: new FormControl(this.initEvent.tags),
      deadline: new FormGroup(
        {
          deadlineDate: new FormControl(this.initEvent.deadline),
          deadlineTime: new FormControl(
            this.initEvent.deadline
              ? p.transform(this.initEvent.deadline)
              : "",
            [Validators.pattern("^([01][0-9]|2[0-3]):([0-5][0-9])$")]
          ),
          participants: new FormControl(this.initEvent.participants, [this.getParticipantFormValidatorFn()]),
        },
        [this.getDeadlineFormValidatorFn()]
      ),
    });
  }

  onAddGroup(group: string) {
    this.persons
      .filter((person) => person.groups.includes(group))
      .forEach((person) => {
        const id = person.id;
        const index = (this.eventForm.get("deadline").get("participants").value as Participant[]).findIndex(
          (part) => part.id === id
        );
        if (index < 0) {
          // add the person as participant
          (this.eventForm.get("deadline").get("participants").value as Participant[]).push({ id, amount: -1, name: person.name });
        }
      });
    // manually run the validity check after a person was clicked
    this.eventForm.get("deadline").get("participants").updateValueAndValidity();
    this.eventForm.get("deadline").get("participants").markAsDirty();
  }

  onRemoveGroup(group: string) {
    this.persons
      .filter((person) => person.groups.includes(group))
      .forEach((person) => {
        const id = person.id;
        const index = (this.eventForm.get("deadline").get("participants").value as Participant[]).findIndex(
          (part) => part.id === id
        );
        if (index >= 0) {
          // remove the participant from the array of participants
          (this.eventForm.get("deadline").get("participants").value as Participant[]).splice(index, 1);
        }
      });
    // manually run the validity check after a person was clicked
    this.eventForm.get("deadline").get("participants").updateValueAndValidity();
    this.eventForm.get("deadline").get("participants").markAsDirty();
  }

  onSubmit() {
    this.eventForm.disable();
    const updated: appEvent = {
      id: this.initEvent.id,
      ownerId: this.initEvent.ownerId,
      ownerName: this.initEvent.ownerName,
      title: this.eventForm.get("title").value,
      description: this.eventForm.get("description").value,
      tags: this.eventForm.get("tags").value,
      startDate: this.getDateFromDateAndTimeStrings(this.eventForm.get("startDate").value, this.eventForm.get("startTime").value),
      endDate: this.getDateFromDateAndTimeStrings(this.eventForm.get("endDate").value, this.eventForm.get("endTime").value),
      deadline: this.getDateFromDateAndTimeStrings(
        this.eventForm.get("deadline").get("deadlineDate").value,
        this.eventForm.get("deadline").get("deadlineTime").value
      ),
      participants: this.eventForm.get("deadline").get("participants").value,
    };
    const action = this.initEvent.id
      ? // save and mark the form as clean again
        this.eventDAO.update(updated).pipe(
          tap(() => {
            this.eventForm.enable();
            this.eventForm.markAsPristine();
          })
        )
      : // save and go to edit event with id
        this.eventDAO.insert(updated).pipe(tap((newId) => this.router.navigate(["events", "edit", newId])));
    this.subs.push(action.subscribe(null, null, null));
  }

  deleteEvent(): void {
    this.subs.push(
      this.eventDAO.delete(this.initEvent.id).subscribe({ next: () => this.router.navigate(["events", "overview"]) })
    );
  }

  private getDateFromDateAndTimeStrings(d: Date, time: string): Date {
    if (!d || !time) return null;
    const nparts: number[] = time.split(":").map((el) => parseInt(el));
    d.setHours(nparts[0], nparts[1]);
    return d;
  }

  getDeadlineFormValidatorFn(): ValidatorFn {
    return (g: FormGroup) => {
      const date = g.get("deadlineDate").value;
      const time = g.get("deadlineTime").value;
      const participantCount = g.get("participants").value.length;
      // invalid if any of the children are invalid
      if (g.get("deadlineDate").invalid || g.get("deadlineTime").invalid || g.get("participants").invalid)
        return { pattern: true };
      // valid if everything is empty
      if (!date && !time && participantCount === 0) return null;
      // invalid if either time or date or both are missing
      if ((date && !time) || (!date && time) || (!date && !time)) return { dateAndTime: true };
      // invalid if participants are missing
      if (g.get("participants").value.length === 0) return { participantsMissing: true };
      return null;
    };
  }

  getParticipantFormValidatorFn(): ValidatorFn {
    return (ctrl: AbstractControl) => {
      const value = ctrl.value as Participant[];
      if (value.length === 0) return null;
      if (value.findIndex((el) => el.id === this.auth.$user.getValue().id) < 0) return { mustContainSelf: true };
      return null;
    };
  }

  isPersonSelected(id: string): boolean {
    return !!(this.eventForm.get("deadline").get("participants").value as Participant[]).find((part) => part.id === id);
  }

  onPersonClick(id: string) {
    const index = (this.eventForm.get("deadline").get("participants").value as Participant[]).findIndex((part) => part.id === id);
    if (index < 0) {
      // add the person as participant
      (this.eventForm.get("deadline").get("participants").value as Participant[]).push({
        id,
        amount: -1,
        name: this.persons.find((p) => p.id === id).name,
      });
    } else {
      // remove the participant from the array of participants
      (this.eventForm.get("deadline").get("participants").value as Participant[]).splice(index, 1);
    }
    // manually run the validity check after a person was clicked
    this.eventForm.get("deadline").get("participants").updateValueAndValidity();
    this.eventForm.get("deadline").get("participants").markAsDirty();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
