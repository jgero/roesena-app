import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ListService } from './list.service';

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss']
})
export class EditingComponent {
  constructor(public listSrv: ListService, private router: Router, private route: ActivatedRoute) {
    console.log(this.route.snapshot.data);
  }

  select(id: string | null) {
    // console.log(this.route.data.events);
    const mode = this.router.url.split('/')[2];
    if (id) {
      this.router.navigate(['edit', mode, id]);
    } else {
      this.router.navigate(['edit', mode]);
    }
  }
}
