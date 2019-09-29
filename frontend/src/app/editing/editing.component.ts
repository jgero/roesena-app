import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-editing',
  templateUrl: './editing.component.html',
  styleUrls: ['./editing.component.scss']
})
export class EditingComponent implements OnDestroy {

  private routerSub: Subscription;
  public activeTab: string;

  constructor(public router: Router) {
    this.routerSub = router.events
      .pipe(filter(routerEvent => routerEvent instanceof NavigationEnd))
      .subscribe({
        next: (routerEvent: NavigationEnd) => {
          this.activeTab = routerEvent.urlAfterRedirects.split('/')[2];
        }
      });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

}
