import { Component, OnDestroy, ElementRef, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

import { AppPerson } from 'src/app/utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/auth/group-manager/reducers/person.reducer';
import { SubscriptionService } from '@services/subscription.service';
import { AddGroup, DeletePerson, LoadPersons, RemoveGroup } from '@state/auth/group-manager/actions/person.actions';
import { ChipsInputService } from '@services/chips-input.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Title } from '@angular/platform-browser';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupDialogComponent } from './add-group-dialog/add-group-dialog.component';
import { DeleteConfirmPopupComponent } from '@shared/delete-confirm/delete-confirm-popup/delete-confirm-popup.component';

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
  isLoading$ = this.store.select('person', 'loadingAction');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  columnsToDisplay = ['name', 'actions'];
  expandedElement: AppPerson | null;

  get limit(): number {
    return Math.floor(window.innerHeight / 2 / 40);
  }

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    public chips: ChipsInputService,
    private dialog: MatDialog,
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

  onAddGroup(id: string) {
    const dialogRef = this.dialog.open(AddGroupDialogComponent);
    dialogRef.afterClosed().subscribe((group) => {
      if (group && group !== '') {
        this.store.dispatch(new AddGroup({ id, group }));
      }
    });
  }

  onRemoveGroup(id: string, group: string) {
    this.store.dispatch(new RemoveGroup({ id, group }));
  }

  onDeleteUser(id: string) {
    const dialogRef = this.dialog.open(DeleteConfirmPopupComponent, { data: { title: 'Person' } });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result === true) {
        this.store.dispatch(new DeletePerson({ id }));
      }
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
