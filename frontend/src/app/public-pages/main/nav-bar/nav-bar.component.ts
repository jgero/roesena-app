import { Component } from '@angular/core';

import { AuthGuard } from '../../../shared/services/auth.guard';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {
  constructor(public auth: AuthGuard) {}
}
