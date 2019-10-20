import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../shared/services/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public username = '';
  public password = '';

  constructor(public auth: AuthGuard) { }

  ngOnInit() { }

  public tryLogin() {
    this.auth.login(this.username, this.password).subscribe({
      complete: () => {
        // login worked, reset fields for next login
        this.username = '';
        this.password = '';
      },
      error: (err) => {
        // login did not work
        console.log(err);
      }
    });
  }

  public tryLogout() {
    this.auth.logout().subscribe({
      error: (err) => {
        // maybe display some kind of message
        console.log(err);
      }
    });
  }
}
