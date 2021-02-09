import { Component, OnDestroy } from '@angular/core';
import { SubscriptionService } from '@services/subscription.service';
import { SeoService } from '@services/seo.service';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { Router } from '@angular/router';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnDestroy {
  constructor(private store: Store<State>, private subs: SubscriptionService, seo: SeoService, private router: Router) {
    seo.setTags('Hilfe', 'Hinweise und Hilfestellungen zur Verwendung der Webseite', undefined, '/help');
  }

  ngAfterViewInit() {
    this.store
      .select('router', 'state', 'url')
      // should only act on first emit and just to be safe unsub on component leave
      .pipe(take(1), takeUntil(this.subs.unsubscribe$))
      .subscribe((route) => {
        // get element from route fragment
        const el = document.getElementById(route.split('#')[1]);
        if (el) {
          // scroll into view should in work in all browsers but the options are not supported in some safari versions
          el.scrollIntoView({ block: 'start' });
        }
      });
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
