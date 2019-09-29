import { Component, OnInit, Input } from '@angular/core';
import { AuthGuard } from 'src/app/shared/services/auth.guard';

@Component({
  selector: 'app-nav-bar-misc',
  templateUrl: './nav-bar-misc.component.html',
  styleUrls: ['./nav-bar-misc.component.scss']
})
export class NavBarMiscComponent {

  @Input()
  public routeParts: string[];

  constructor(public auth: AuthGuard) { }

}
