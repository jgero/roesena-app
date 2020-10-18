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
import {
  LoadPersons,
  PersonActionTypes,
  PersonActions,
  AddGroup,
  RemoveGroup,
} from '@state/auth/group-manager/actions/person.actions';
import { ChipsInputService } from '@services/chips-input.service';
import { Actions, ofType } from '@ngrx/effects';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Title } from '@angular/platform-browser';
import { animate, state, style, transition, trigger } from '@angular/animations';

interface AppPersonWithLoading extends AppPerson {
  isConfrimationLoading: boolean;
  isDeletionLoading: boolean;
}

@Component({
  selector: 'app-group-manager',
  templateUrl: './group-manager.component.html',
  styleUrls: ['./group-manager.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GroupManagerComponent implements OnInit, OnDestroy {
  length$ = this.store.select('person', 'length');
  persons$ = this.store.select('person', 'persons');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  columnsToDisplay = ['name', 'actions'];
  expandedElement: AppPerson | null;

  get limit(): number {
    return 15;
    // return Math.ceil(window.innerHeight / 50 / 20);
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

  onAddGroup(id: string, group: string) {
    // this.store.dispatch(new AddGroup({ id, group }));
  }

  onRemoveGroup(id: string, group: string) {
    // this.store.dispatch(new RemoveGroup({ id, group }));
    console.log('remove');
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
