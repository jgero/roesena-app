import { FormGroup, FormControl } from "@angular/forms";
import { Component, OnDestroy } from "@angular/core";
import { MatChipInputEvent } from "@angular/material/chips";
import { PageEvent } from "@angular/material/paginator";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { appPerson } from "src/app/utils/interfaces";
import { Direction } from "src/app/utils/enums";

interface appPersonWithForm extends appPerson {
  form: FormGroup;
}

@Component({
  selector: "app-group-manager",
  templateUrl: "./group-manager.component.html",
  styleUrls: ["./group-manager.component.scss"],
})
export class GroupManagerComponent implements OnDestroy {
  $persons: Observable<appPersonWithForm[]>;
  $count: Observable<number>;
  pageIndex: number = 0;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private subs: Subscription[] = [];

  constructor(private personsDAO: PersonDalService) {
    this.$count = personsDAO.getPersonAmount();
    this.$persons = this.constructFormObservable(personsDAO.getPage(10, Direction.initial));
  }

  onPage(ev: PageEvent) {
    if (ev.pageIndex !== ev.previousPageIndex) {
      this.$persons = this.constructFormObservable(
        this.personsDAO.getPage(10, ev.pageIndex > ev.previousPageIndex ? Direction.forward : Direction.back)
      );
      this.pageIndex = ev.pageIndex;
    }
  }

  onSubmit(id: string, isConfirmedMember: boolean, groups: string[], name: string, form: FormGroup) {
    form.disable();
    this.personsDAO.update({ id, isConfirmedMember, groups, name }).subscribe({
      next: () => {
        form.markAsPristine();
        form.enable();
      },
    });
  }

  private constructFormObservable(data: Observable<appPerson[]>): Observable<appPersonWithForm[]> {
    return data.pipe(
      map((persons) => {
        console.log(persons);
        persons = persons.map((person) => ({
          ...person,
          form: new FormGroup({
            groups: new FormControl(person.groups),
            confirmed: new FormControl(person.isConfirmedMember),
          }),
        }));
        return persons as appPersonWithForm[];
      })
    );
  }

  removeGroup(tag: string, form: FormGroup) {
    (form.get("groups").value as string[]).splice(
      (form.get("groups").value as string[]).findIndex((el) => el === tag),
      1
    );
    form.get("groups").markAsDirty();
  }

  addGroup(event: MatChipInputEvent, form: FormGroup) {
    let value = event.value.trim();
    if (value !== "") {
      (form.get("groups").value as string[]).push(event.value);
    }
    event.input.value = "";
    form.get("groups").markAsDirty();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
