import { Component, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { DoLogin } from '@state/auth/actions/auth.actions';
import { State } from '@state/auth/reducers/auth.reducer';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  private subs: Subscription[] = [];
  isLoading$ = this.store.select('auth', 'isLoading');

  constructor(private store: Store<State>, seo: SeoService) {
    seo.setTags('Login', 'Anmeldeseite der RöSeNa-App', undefined, '/auth/login');
    this.subs.push(
      // enable and disable the form while loading
      this.store.select('auth', 'isLoading').subscribe({
        next: (isLoading) => {
          if (isLoading) {
            this.loginForm.disable();
          } else {
            this.loginForm.enable();
          }
        },
      })
    );
  }

  onSubmit() {
    this.store.dispatch(
      new DoLogin({ email: this.loginForm.get('email').value, password: this.loginForm.get('password').value })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
