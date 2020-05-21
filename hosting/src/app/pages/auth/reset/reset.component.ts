import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State } from '@state/auth/reducers/auth.reducer';
import { DoReset, DoChangePasswordWithCode } from '@state/auth/actions/auth.actions';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent {
  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  newPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  constructor(private store: Store<State>) {}

  onResetSubmit() {
    this.store.dispatch(new DoReset({ email: this.resetForm.get('email').value }));
  }

  onNewPasswordSubmit() {
    this.store.dispatch(new DoChangePasswordWithCode({ password: this.newPasswordForm.get('password').value }));
  }
}
