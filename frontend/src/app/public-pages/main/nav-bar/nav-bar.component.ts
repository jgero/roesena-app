import { Component, OnDestroy } from '@angular/core';
import { AuthGuard } from '../../../shared/services/auth.guard';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { trigger, transition, query, animate, style } from '@angular/animations';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
  animations: [
    trigger('barAnimation', [
      transition('void => *', [
        query(':self', [
          style({ height: 0, opacity: 0 }),
          animate('0.2s', style({ height: '3.5rem', opacity: 1 }))
        ], { optional: true })
      ]),
      transition('* => void', [
        query(':self', [
          animate('0.2s', style({ height: 0, opacity: 0 }))
        ], { optional: true })
      ])
    ])
  ]
})
export class NavBarComponent implements OnDestroy {

  private routerSub: Subscription;
  public routeParts: string[] = [];

  private routeTree = [
    { path: 'groups', children: [] },
    { path: 'events', children: [] },
    { path: 'archive', children: [] },
    { path: 'calendar', children: [] },
    { path: 'images', children: [] },
    {
      path: 'edit', children: [
        { path: 'edit/persons', title: 'Personen', children: [] },
        { path: 'edit/events', title: 'Events', children: [] },
        { path: 'edit/articles', title: 'Artikel', children: [] },
        { path: 'edit/images', title: 'Bilder', children: [] }
      ]
    }
  ];

  constructor(public auth: AuthGuard, public router: Router) {
    this.routerSub = router.events
      .pipe(filter(routerEvent => routerEvent instanceof NavigationEnd))
      .subscribe({
        next: (routerEvent: NavigationEnd) => {
          this.routeParts = routerEvent.urlAfterRedirects.split('/').filter(el => el && el !== '');
        }
      });
  }

  public getSecondLayer() {
    if (this.routeParts.length === 0) {
      return [];
    }
    return this.routeTree.find(el => el.path === this.routeParts[0]).children;
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

}
