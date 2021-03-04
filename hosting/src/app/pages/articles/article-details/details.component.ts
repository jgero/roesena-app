import { Component, OnDestroy } from '@angular/core';

import { AppArticle } from 'src/app/utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { LoadSingleArticle } from '@state/articles/actions/article.actions';
import { tap } from 'rxjs/operators';
import { SubscriptionService } from '@services/subscription.service';
import { canEdit } from '@state/articles';
import { AddSearchString } from '@state/searching/actions/search.actions';
import { SeoService } from '@services/seo.service';
import { of } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnDestroy {
  article$ = this.store.select('articles', 'activeArticle').pipe(
    tap((article) => {
      if (!!article) {
        this.seo.setTags(
          article.title,
          article.content.substring(0, 30).concat('...'),
          undefined,
          `/articles/details/${article.id})`
        );
      }
    })
  );
  image$ = of('');
  isLoading$ = this.store.select('articles', 'isLoading');
  canEdit$ = this.store.select(canEdit);

  constructor(private store: Store<State>, private sub: SubscriptionService, private seo: SeoService) {
    this.store.dispatch(new LoadSingleArticle());
  }

  onTagClick(tag: string) {
    this.store.dispatch(new AddSearchString({ searchString: tag }));
  }

  fillSearchForImages(val: AppArticle): void {}

  ngOnDestroy() {
    this.sub.unsubscribeComponent$.next();
  }
}
