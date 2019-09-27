import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../shared/services/auth.guard';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(public auth: AuthGuard, private router: Router) { }

  ngOnInit() { }

  public tryLogout() {
    this.auth.logout().subscribe({
      complete: () => {
        this.router.navigate(['']);
      },
      error: (err) => {
        // maybe display some kind of message
        console.log(err);
      }
    });
  }

}
