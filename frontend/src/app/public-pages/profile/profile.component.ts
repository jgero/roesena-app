import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../../shared/services/auth.guard';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public myEvents: string[] = [];

  constructor(public auth: AuthGuard, private router: Router, private http: HttpClient) {
    this.http.get<any[]>('/api/event?id=*').subscribe({
      next: (persons) => this.myEvents = persons.filter(el => el.participants.includes(this.auth.user.getValue()._id)).map(el => el.title)
    });
  }

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
