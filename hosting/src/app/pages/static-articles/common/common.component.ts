import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { SubscriptionService } from '@services/subscription.service';
import { SeoService } from '@services/seo.service';
import { take, map } from 'rxjs/operators';
import { LoadSingleImage } from '@state/images';
import { LoadSingleArticle } from '@state/articles';
import { UTILITY_TAGS } from '@shared/constants';

@Component({
  selector: 'app-common',
  templateUrl: './common.component.html',
  styleUrls: ['./common.component.scss'],
})
export class CommonComponent implements OnDestroy, OnInit {
  textData$ = this.store.select('articles', 'activeArticle');
  searchLinkTags$ = this.textData$.pipe(
    map((article) => article.tags.filter((tag) => !UTILITY_TAGS.includes(tag))),
    map((tags) => tags.join(','))
  );
  imageUrl$ = this.store.select('images', 'activeImageFullUrl');
  externalPageLink$ = this.store.select('router', 'state', 'data', 'additionalLink');
  heading$ = this.store.select('router', 'state', 'data', 'heading');

  constructor(private store: Store<State>, private subs: SubscriptionService, private seo: SeoService) {}

  ngOnInit() {
    this.store
      .select('router', 'state')
      .pipe(take(1))
      .subscribe((routerState) => {
        this.seo.setTags(
          routerState.data.heading,
          `Ein Artikel über Gruppen der RöSeNa und aus der Chronik: ${routerState.data.heading}`,
          undefined,
          routerState.url
        );
        this.store.dispatch(new LoadSingleImage({ tags: routerState.data.filterTags }));
        this.store.dispatch(new LoadSingleArticle({ tags: routerState.data.filterTags }));
      });
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
