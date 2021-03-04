import { Component, OnDestroy, ElementRef, OnInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

import { AppPerson } from 'src/app/utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { SubscriptionService } from '@services/subscription.service';
import { AddGroup, DeletePerson, LoadPersons, RemoveGroup, ConfirmPerson } from '@state/persons';
import { ChipsInputService } from '@services/chips-input.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { AddGroupDialogComponent } from './add-group-dialog/add-group-dialog.component';
import { DeleteConfirmPopupComponent } from '@shared/delete-confirm/delete-confirm-popup/delete-confirm-popup.component';
import { SeoService } from '@services/seo.service';

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
  length$ = this.store.select('persons', 'amount');
  persons$ = this.store.select('persons', 'persons');
  isLoading$ = this.store.select('persons', 'isLoading');
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
    seo: SeoService
  ) {
    seo.setTags('Gruppenmanager', 'Hier können Administratoren die Benutzer der App verwalten', undefined, '/auth/group-manager');
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

  onConfirmPerson(id: string) {
    this.store.dispatch(new ConfirmPerson({ id }));
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
