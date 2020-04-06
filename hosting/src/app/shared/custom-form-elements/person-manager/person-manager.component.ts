import { Component, Input, Output, EventEmitter, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { AuthService } from "src/app/services/auth.service";
import { appPerson } from "src/app/utils/interfaces";

@Component({
  selector: "app-person-manager",
  templateUrl: "./person-manager.component.html",
  styleUrls: ["./person-manager.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersonManagerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PersonManagerComponent,
      multi: true,
    },
  ],
})
export class PersonManagerComponent implements ControlValueAccessor {
  $persons: Observable<appPerson[]>;
  isDisabled = false;
  groups: string[] = [];

  @Input()
  public value: { id: string; amount: number }[] = [];
  @Output()
  public valueChange = new EventEmitter<{ id: string; amount: number }[]>();
  @Input()
  mustContainCurrentUser = false;

  private propagateChange: (_: any) => {};
  private propagateTouch: () => {};

  constructor(personsDAO: PersonDalService, public auth: AuthService) {
    this.$persons = personsDAO.getPersonsStream().pipe(
      tap((persons) => {
        this.groups = [];
        // go through all persons and groups of these persons
        persons.forEach((person) => {
          person.groups.forEach((group) => {
            // if the group already is in the list do nothing
            if (this.groups.findIndex((el) => el === group) >= 0) return;
            // add the group to the list
            this.groups.push(group);
          });
        });
      })
    );
  }

  addGroupMembers(group: string, persons: appPerson[]) {
    // go through all persons
    persons.forEach((person) => {
      // if person has that group and is not selected already add it
      if (person.groups.includes(group) && this.value.findIndex((participant) => participant.id === person.id) < 0) {
        this.value.push({ id: person.id, amount: -1 });
      }
    });
    this.valueChange.emit(this.value);
    this.propagateChange(this.value);
    this.propagateTouch();
  }

  toggleId(id: string) {
    if (this.isDisabled) return;
    const selectedIndex = this.value.findIndex((el) => el.id === id);
    if (selectedIndex >= 0) {
      this.value.splice(selectedIndex, 1);
    } else {
      this.value.push({ id, amount: -1 });
    }
    this.valueChange.emit(this.value);
    this.propagateChange(this.value);
    this.propagateTouch();
  }

  isSelected(id: string): boolean {
    return !!this.value.find((el) => id === el.id);
  }

  validate({ value }: FormControl): ValidationErrors | null {
    // value has to be an array
    if (!Array.isArray(value)) return { invalid: true };
    // empty selection is allowed
    if (value.length === 0) return null;
    // check if current user is in the selection if it's required
    if (
      this.mustContainCurrentUser &&
      !((value as { id: string; amount: number }[]).findIndex((el) => el.id === this.auth.$user.getValue().id) >= 0)
    )
      return { invalid: true };
    // otherwise the value is valid
    return null;
  }
  writeValue(obj: any): void {
    if (!obj) return;
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
