import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { State } from '@state/auth/reducers/auth.reducer';
import { DoRegister } from '@state/auth/actions/auth.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  private subs: Subscription[] = [];

  constructor(private store: Store<State>) {
    this.subs.push(
      // enable and disable the form while loading
      this.store.select('auth', 'isLoading').subscribe({
        next: (isLoading) => {
          if (isLoading) {
            this.registerForm.disable();
          } else {
            this.registerForm.enable();
          }
        },
      })
    );
  }

  onSubmit() {
    this.store.dispatch(
      new DoRegister({
        email: this.registerForm.get('email').value,
        password: this.registerForm.get('password').value,
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
