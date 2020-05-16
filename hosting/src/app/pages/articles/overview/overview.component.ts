import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { cardFlyIn } from 'src/app/utils/animations';
import { AppArticle } from 'src/app/utils/interfaces';
import { updateSearchStrings, addSearchString } from 'src/app/actions/article-overview.actions';
import { AppStore } from 'src/app/reducers';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent {
  data$: Observable<AppArticle[]> = this.store.select('articleOverviewState', 'articles');
  isLoading$: Observable<boolean> = this.store.select('articleOverviewState', 'isLoading');
  searchStrings$: Observable<string[]> = this.store.select('articleOverviewState', 'searchStrings');
  canEdit$: Observable<boolean> = this.store.select('authState').pipe(map((state) => state.isAuthor || state.isAdmin));

  constructor(public store: Store<AppStore>) {}

  onSearch(event: string[]) {
    this.store.dispatch(updateSearchStrings({ searchStrings: event }));
  }

  addSearchString(searchString: string) {
    this.store.dispatch(addSearchString({ searchString }));
  }
}
