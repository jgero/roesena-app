import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { cardFlyIn } from 'src/app/utils/animations';
import { AppArticle } from 'src/app/utils/interfaces';
import { PageEvent } from '@angular/material/paginator';
import { State } from '@state/articles/reducers/article.reducer';
import { AddSearchString } from '@state/searching/actions/search.actions';
import { PageForward, PageBackwards } from '@state/articles/actions/article.actions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent {
  data$: Observable<AppArticle[]> = this.store.select('article', 'articles');
  dataLength$: Observable<number> = this.store.select('article', 'dataLength');
  isLoading$: Observable<boolean> = this.store.select('article', 'isLoading');
  // canEdit$: Observable<boolean> = this.store.select('authState').pipe(map((state) => state.isAuthor || state.isAdmin));
  canEdit$: Observable<boolean> = of(false);
  columns$: Observable<number> = this.store.select('article', 'columns');
  limit$: Observable<number> = this.store.select('article', 'limit');
  pageIndex$: Observable<number> = this.store.select('article', 'pageIndex');

  constructor(public store: Store<State>) {}

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
}
