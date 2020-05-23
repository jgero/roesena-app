import { Component, OnInit, OnDestroy } from '@angular/core';

import { AppArticle } from 'src/app/utils/interfaces';
import { Store } from '@ngrx/store';
import { State } from '@state/articles/reducers/article.reducer';
import { LoadSingleArticle } from '@state/articles/actions/article.actions';
import { map } from 'rxjs/operators';
import { SubscriptionService } from '@services/subscription.service';

@Component({
  selector: 'app-detail',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnDestroy {
  article$ = this.store.select('article', 'article');
  image$ = this.store.select('article', 'image');
  isLoading$ = this.store.select('article', 'isLoading');
  canEdit$ = this.store.select('user').pipe(map((state) => state.isAuthor || state.isAdmin));

  constructor(private store: Store<State>, private sub: SubscriptionService) {
    this.store.dispatch(new LoadSingleArticle());
  }

  getLinkToImages(val: AppArticle): string {
    return `/images/overview/${val.tags.join(',')}`;
  }

  ngOnDestroy() {
    this.sub.unsubscribeComponent$.next();
  }
}
