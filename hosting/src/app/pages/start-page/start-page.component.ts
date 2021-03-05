import { Component, OnInit, OnDestroy } from '@angular/core';
import { State } from '@state/state.module';
import { Store } from '@ngrx/store';
import { SubscriptionService } from '@services/subscription.service';
import { SeoService } from '@services/seo.service';
import { forStartpage as eventForStartpage, LoadAllEvents } from '@state/events';
import { forStartpage as articleForStartpage, LoadArticlePage } from '@state/articles';
import { LoadStartPage } from '@state/images';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss'],
})
export class StartPageComponent implements OnInit, OnDestroy {
  images$ = this.store.select('images', 'startpageTiles');
  event$ = this.store.select(eventForStartpage);
  article$ = this.store.select(articleForStartpage);

  public readonly tilesPerRow = 2;

  constructor(private store: Store<State>, private subs: SubscriptionService, seo: SeoService) {
    seo.setTags(undefined, 'Webseite der Röhlinger Sechtanarren', undefined, '/');
  }

  getRowStyle(index: number): boolean {
    return Math.floor(index / this.tilesPerRow) % 2 === 1;
  }

  ngOnInit() {
    this.store.dispatch(new LoadStartPage({ tileAmount: 4 }));
    //this.store.dispatch(new LoadArticlePage({ limit: 1 }));
    //this.store.dispatch(new LoadAllEvents());
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
