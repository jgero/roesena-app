import { Component, OnInit, OnDestroy } from '@angular/core';
import { State } from '@state/basePages/reducers/base.reducer';
import { Store } from '@ngrx/store';
import { LoadStartpageContent } from '@state/basePages/actions/base.actions';
import { SubscriptionService } from '@services/subscription.service';
import { SeoService } from '@services/seo.service';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent implements OnInit, OnDestroy {
  event$ = this.store.select('base', 'startpageEvent');
  article$ = this.store.select('base', 'startpageArticle');

  constructor(private store: Store<State>, private subs: SubscriptionService, seo: SeoService) {
    seo.setTags(undefined, 'Webseite der Röhlinger Sechtanarren', undefined, '/');
  }

  ngOnInit() {
    this.store.dispatch(new LoadStartpageContent());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
