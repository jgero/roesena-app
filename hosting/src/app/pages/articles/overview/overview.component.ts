import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { cardFlyIn } from 'src/app/utils/animations';
import { AppArticle } from 'src/app/utils/interfaces';
import { AppStore } from 'src/app/reducers';
import { addString } from 'src/app/actions/search.actions';
import { init, pageForward, pageBackwards } from 'src/app/actions/article-overview.actions';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent {
  data$: Observable<AppArticle[]> = this.store.select('articleOverviewState', 'articles');
  dataLength$: Observable<number> = this.store.select('articleOverviewState', 'dataLength');
  isLoading$: Observable<boolean> = this.store.select('articleOverviewState', 'isLoading');
  canEdit$: Observable<boolean> = this.store.select('authState').pipe(map((state) => state.isAuthor || state.isAdmin));
  columns$: Observable<number> = this.store.select('articleOverviewState', 'columns');
  limit$: Observable<number> = this.store.select('articleOverviewState', 'limit');
  pageIndex$: Observable<number> = this.store.select('articleOverviewState', 'pageIndex');

  constructor(public store: Store<AppStore>) {
    this.store.dispatch(init());
  }

  addSearchString(searchString: string) {
    this.store.dispatch(addString({ searchString }));
  }

  onPage(event: PageEvent) {
    if (event.pageIndex > event.previousPageIndex) {
      this.store.dispatch(pageForward());
    } else {
      this.store.dispatch(pageBackwards());
    }
  }
}
