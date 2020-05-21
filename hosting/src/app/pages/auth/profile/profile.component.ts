import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { State } from '@state/auth/reducers/auth.reducer';
import { DoLogout, DoChangeName } from '@state/auth/actions/auth.actions';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnDestroy {
  updateNameForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZäöüÄÖÜß -]+$')]),
  });
  private subs: Subscription[] = [];
  isLoading$ = this.store.select('auth', 'isLoading');
  user$ = this.store.select('user', 'user');

  constructor(private store: Store<State>) {
    this.subs.push(
      // enable and disable the form while loading
      this.store.select('auth', 'isLoading').subscribe({
        next: (isLoading) => {
          if (isLoading) {
            this.updateNameForm.disable();
          } else {
            this.updateNameForm.enable();
          }
        },
      })
    );
  }

  onUpdateNameSubmit() {
    this.store.dispatch(new DoChangeName({ newName: this.updateNameForm.get('name').value }));
    this.updateNameForm.reset();
  }

  logout() {
    this.store.dispatch(new DoLogout());
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
