import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { State } from '@state/auth/reducers/auth.reducer';
import { DoReset, DoChangePasswordWithCode } from '@state/auth/actions/auth.actions';
import { Title } from '@angular/platform-browser';

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
  hasCode$ = this.store.select('router', 'state', 'queryParams').pipe(map((params) => !!params && !!params.oobCode));

  constructor(private store: Store<State>, titleService: Title) {
    titleService.setTitle('RöSeNa - Passwort zurücksetzen');
  }

  onResetSubmit() {
    this.store.dispatch(new DoReset({ email: this.resetForm.get('email').value }));
  }

  onNewPasswordSubmit() {
    this.store.dispatch(new DoChangePasswordWithCode({ password: this.newPasswordForm.get('password').value }));
  }
}
