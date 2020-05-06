import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy, OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  private subs: Subscription[] = [];

  constructor(private auth: AuthService, private location: Location, private router: Router) {}

  ngOnInit() {
    this.subs.push(
      this.auth.$user.pipe(filter((el) => !!el)).subscribe({
        next: () => this.goBack(),
      })
    );
  }

  private goBack() {
    if ((this.location.getState() as any).navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigate(['']);
    }
  }

  onSubmit() {
    this.loginForm.disable();
    this.subs.push(
      this.auth
        .login(this.loginForm.get('email').value, this.loginForm.get('password').value)
        .subscribe({ next: () => this.loginForm.enable() })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
