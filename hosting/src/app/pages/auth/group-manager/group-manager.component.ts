import { Router, ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl } from "@angular/forms";
import { Component, OnDestroy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";

import { PageEvent } from "@angular/material/paginator";
import { ENTER, COMMA } from "@angular/cdk/keycodes";

import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { appPerson } from "src/app/utils/interfaces";
import { PaginatedOverview } from "src/app/utils/ui-abstractions";
import { AuthService } from "src/app/services/auth.service";
import { ChipsInputService } from "src/app/services/chips-input.service";

interface appPersonWithForm extends appPerson {
  form: FormGroup;
}

@Component({
  selector: "app-group-manager",
  templateUrl: "./group-manager.component.html",
  styleUrls: ["./group-manager.component.scss"],
})
export class GroupManagerComponent extends PaginatedOverview implements OnDestroy {
  $data: Observable<appPerson[]>;
  $withForm: Observable<appPersonWithForm[]>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private subs: Subscription[] = [];
  get cols(): number {
    return Math.ceil(window.innerWidth / 700);
  }

  constructor(
    private personsDAO: PersonDalService,
    router: Router,
    route: ActivatedRoute,
    auth: AuthService,
    public chips: ChipsInputService
  ) {
    super(["auth", "group-manager"], personsDAO, route, router, auth);
  }

  updateDataStream() {
    // first let the base classes request the data
    super.updateDataStream();
    // and then add the form to it
    this.updateForm();
  }

  private updateForm() {
    this.$withForm = this.$data.pipe(
      map((persons) => {
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

  onPage(ev: PageEvent) {
    // let the super class do the update stuff
    super.onPage(ev);
    if (ev.pageIndex !== ev.previousPageIndex) {
      // and update the observable if needed
      this.updateForm();
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

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
    super.ngOnDestroy();
  }
}
