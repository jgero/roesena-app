import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';
import { trigger, transition, style, query, animateChild, group, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public router: Router, public auth: AuthGuard) { }

  public navigate(destination: string): void {
    this.router.navigate([destination]);
  }
}


