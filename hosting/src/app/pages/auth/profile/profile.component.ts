import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription, SubscriptionLike } from 'rxjs';
import { State } from '@state/auth/reducers/auth.reducer';
import { DoLogout, DoChangeName } from '@state/auth/actions/auth.actions';
import { DeletePerson } from '@state/auth/group-manager/actions/person.actions';
import { SubscriptionService } from '@services/subscription.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
  isLoading$ = this.store.select('auth', 'isLoading');
  user$ = this.store.select('user', 'user');

  constructor(private store: Store<State>, private subs: SubscriptionService) {}

  onDeleteProfile(id: string) {
    this.store.dispatch(new DeletePerson({ id }));
  }

  onUpdateNameSubmit(inputElement: HTMLInputElement, id: string) {
    this.store.dispatch(new DoChangeName({ newName: inputElement.value, id }));
    inputElement.value = '';
  }

  logout() {
    this.store.dispatch(new DoLogout());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
