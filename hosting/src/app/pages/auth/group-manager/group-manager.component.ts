import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnDestroy, ElementRef, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { PageEvent } from '@angular/material/paginator';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

import { AppPerson } from 'src/app/utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/auth/group-manager/reducers/person.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { LoadPersons, PersonActionTypes, PersonActions } from '@state/auth/group-manager/actions/person.actions';
import { ChipsInputService } from '@services/chips-input.service';
import { Actions, ofType } from '@ngrx/effects';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Title } from '@angular/platform-browser';

interface AppPersonWithLoading extends AppPerson {
  isConfrimationLoading: boolean;
  isDeletionLoading: boolean;
}

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.scss'],
})
export class GroupManagerComponent implements OnInit, OnDestroy {
  length$ = this.store.select('person', 'length');
  persons$ = this.store.select('person', 'persons');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  get cols(): number {
    return Math.ceil(window.innerWidth / 700);
  }
  get limit(): number {
    return this.cols * 5;
  }

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    public chips: ChipsInputService,
    titleService: Title
  ) {
    titleService.setTitle('RöSeNa - Gruppenmanager');
  }

  ngOnInit() {
    this.store.dispatch(new LoadPersons({ limit: this.limit }));
  }

  onCheckboxChange(ev: MatCheckboxChange) {
    this.store.dispatch(new LoadPersons({ limit: this.limit, onlyUnconfirmed: ev.checked }));
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
