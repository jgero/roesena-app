import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { Logout, ChangeName, DeletePerson } from '@state/persons';
import { SubscriptionService } from '@services/subscription.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
  isLoading$ = this.store.select('persons', 'isLoading');
  user$ = this.store.select('persons', 'user');

  constructor(private store: Store<State>, private subs: SubscriptionService, seo: SeoService, private dialog: MatDialog) {
    seo.setTags('Profil', 'Dein Profil der RöSeNa-App', undefined, '/auth/profile');
  }

  onDeleteProfile(id: string) {
    this.dialog
      .open(DeleteDialogComponent)
      .afterClosed()
      .pipe(takeUntil(this.subs.unsubscribe$))
      .subscribe((result) => {
        if (result) {
          this.store.dispatch(new DeletePerson({ id }));
        }
      });
  }

  onUpdateNameSubmit(inputElement: HTMLInputElement, id: string) {
    this.store.dispatch(new ChangeName({ newName: inputElement.value, id }));
    inputElement.value = '';
  }

  logout() {
    this.store.dispatch(new Logout());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: 'delete-dialog.html',
})
export class DeleteDialogComponent {}
