import { Component, OnInit, Input } from '@angular/core';
import { AuthGuard } from 'src/app/shared/services/auth.guard';

@Component({
  selector: 'app-nav-bar-navigators',
  templateUrl: './nav-bar-navigators.component.html',
  styleUrls: ['./nav-bar-navigators.component.scss']
})
export class NavBarNavigatorsComponent implements OnInit {

  @Input()
  public routeParts: string[];

  constructor(public auth: AuthGuard) { }

  ngOnInit() {
  }

}
