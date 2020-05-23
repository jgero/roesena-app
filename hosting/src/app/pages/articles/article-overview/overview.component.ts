import { Component, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '@state/articles/reducers/article.reducer';
import { AddSearchString } from '@state/searching/actions/search.actions';
import { PageForward, PageBackwards, LoadArticles } from '@state/articles/actions/article.actions';
import { SubscriptionService } from '@services/subscription.service';
import { cardFlyIn } from '@utils/animations';
import { AppArticle } from '@utils/interfaces';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent implements OnDestroy {
  data$: Observable<AppArticle[]> = this.store.select('article', 'articles');
  dataLength$: Observable<number> = this.store.select('article', 'dataLength');
  isLoading$: Observable<boolean> = this.store.select('article', 'isLoading');
  canEdit$: Observable<boolean> = this.store.select('user').pipe(map((state) => state.isAuthor || state.isAdmin));
  columns$: Observable<number> = this.store.select('article', 'columns');
  limit$: Observable<number> = this.store.select('article', 'limit');
  pageIndex$: Observable<number> = this.store.select('article', 'pageIndex');

  constructor(private store: Store<State>, private sub: SubscriptionService) {
    this.store.dispatch(new LoadArticles());
  }

  addSearchString(searchString: string) {
    this.store.dispatch(new AddSearchString({ searchString }));
  }

  onPage(event: PageEvent) {
    if (event.pageIndex > event.previousPageIndex) {
      this.store.dispatch(new PageForward());
    } else {
      this.store.dispatch(new PageBackwards());
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribeComponent$.next();
  }
}
