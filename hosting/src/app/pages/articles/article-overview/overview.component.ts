import { Component, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { SubscriptionService } from '@services/subscription.service';
import { cardFlyIn } from '@utils/animations';
import { AppArticle } from '@utils/interfaces';
import { State } from '@state/articles/overview/reducers/article.reducer';
import { LoadArticles } from '@state/articles/overview/actions/article.actions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent implements OnDestroy {
  data$: Observable<AppArticle[]> = this.store.select('articleOverview', 'articles');
  length$: Observable<number> = this.store.select('articleOverview', 'length');
  canEdit$: Observable<boolean> = this.store.select('user').pipe(map((state) => state.isAuthor || state.isAdmin));

  get cols(): number {
    return Math.ceil(window.innerWidth / 700);
  }
  get limit(): number {
    return this.cols * 5;
  }

  constructor(private store: Store<State>, private sub: SubscriptionService) {
    this.store.dispatch(new LoadArticles({ limit: this.limit }));
  }

  ngOnDestroy() {
    this.sub.unsubscribeComponent$.next();
  }
}
