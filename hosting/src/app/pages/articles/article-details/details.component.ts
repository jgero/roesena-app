import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { LoadSingleArticle } from '@state/articles/actions/article.actions';
import { tap, map } from 'rxjs/operators';
import { SubscriptionService } from '@services/subscription.service';
import { canEdit } from '@state/articles';
import { SeoService } from '@services/seo.service';
import { LoadSingleImage } from '@state/images';

@Component({
  selector: 'app-detail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnDestroy {
  article$ = this.store.select('articles', 'activeArticle').pipe(
    tap((article) => {
      if (!!article) {
        this.store.dispatch(new LoadSingleImage({ tags: article.tags }));
        this.seo.setTags(
          article.title,
          article.content.substring(0, 30).concat('...'),
          undefined,
          `/articles/details/${article.id})`
        );
      }
    })
  );
  searchLinkTags$ = this.article$.pipe(
    map((article) => article.tags.filter((tag) => tag !== 'Gruppenseite')),
    map((tags) => tags.join(','))
  );
  imageUrl$ = this.store.select('images', 'activeImageFullUrl');
  externalPageLink$ = this.store.select('router', 'state', 'data', 'additionalLink');
  isLoading$ = this.store.select('articles', 'isLoading');
  canEdit$ = this.store.select(canEdit);

  constructor(private store: Store<State>, private sub: SubscriptionService, private seo: SeoService) {
    this.store.dispatch(new LoadSingleArticle());
  }

  ngOnDestroy() {
    this.sub.unsubscribeComponent$.next();
  }
}
