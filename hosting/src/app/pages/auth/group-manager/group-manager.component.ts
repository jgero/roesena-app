import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { PageEvent } from '@angular/material/paginator';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

import { AppPerson } from 'src/app/utils/interfaces';

interface AppPersonWithForm extends AppPerson {
  form: FormGroup;
}

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.scss'],
})
export class GroupManagerComponent implements OnDestroy {
  $data: Observable<AppPerson[]>;
  $withForm: Observable<AppPersonWithForm[]>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private subs: Subscription[] = [];
  get cols(): number {
    return Math.ceil(window.innerWidth / 700);
  }

  constructor() {}

  updateDataStream() {
    // first let the base classes request the data
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
        return persons as AppPersonWithForm[];
      })
    );
  }

  onPage(ev: PageEvent) {
    // let the super class do the update stuff
    if (ev.pageIndex !== ev.previousPageIndex) {
      // and update the observable if needed
      this.updateForm();
    }
  }

  onSubmit(id: string, isConfirmedMember: boolean, groups: string[], name: string, form: FormGroup) {
    // form.disable();
    // this.personsDAO.update({ id, isConfirmedMember, groups, name }).subscribe({
    //   next: () => {
    //     form.markAsPristine();
    //     form.enable();
    //   },
    // });
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
