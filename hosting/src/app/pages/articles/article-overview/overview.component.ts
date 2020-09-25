import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SubscriptionService } from '@services/subscription.service';
import { AppArticle } from '@utils/interfaces';
import { State } from '@state/articles/overview/reducers/article.reducer';
import { LoadArticles } from '@state/articles/overview/actions/article.actions';
import { canCreate } from '@state/user/selectors/user.selectors';
import { cardFlyIn } from '@utils/animations/card-fly-in';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent implements OnInit, OnDestroy {
  data$: Observable<AppArticle[]> = this.store.select('articleOverview', 'articles');
  length$: Observable<number> = this.store.select('articleOverview', 'length');
  isLoading$: Observable<boolean> = this.store.select('articleOverview', 'isLoading');
  canCreate$: Observable<boolean> = this.store.select((state) => canCreate(state));

  get cols(): number {
    return Math.round(this.hostRef.nativeElement.clientWidth / 420);
  }
  get limit(): number {
    return this.cols * 5;
  }

  constructor(
    private store: Store<State>,
    private sub: SubscriptionService,
    private hostRef: ElementRef<HTMLElement>,
    titleService: Title
  ) {
    titleService.setTitle('RöSeNa - Artikel');
  }

  ngOnInit() {
    this.store.dispatch(new LoadArticles({ limit: this.limit }));
  }

  ngOnDestroy() {
    this.sub.unsubscribeComponent$.next();
  }
}
