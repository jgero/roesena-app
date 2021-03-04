import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { State } from '@state/state.module';
import { Reset, ChangePasswordWithCode } from '@state/persons';
import { SeoService } from '@services/seo.service';

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
  loading = false;

  constructor(private store: Store<State>, seo: SeoService) {
    seo.setTags(
      'Passwort zurücksetzen',
      'Seite zum zurücksetzen des Passworts deines Profils in der RöSeNa-App',
      undefined,
      '/auth/reset'
    );
  }

  onResetSubmit() {
    this.store.dispatch(new Reset({ email: this.resetForm.get('email').value }));
  }

  onNewPasswordSubmit() {
    this.loading = true;
    this.store.dispatch(new ChangePasswordWithCode({ password: this.newPasswordForm.get('password').value }));
  }
}
