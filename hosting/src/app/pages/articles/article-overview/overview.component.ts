import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SubscriptionService } from '@services/subscription.service';
import { AppArticle } from '@utils/interfaces';
import { State } from '@state/state.module';
import { canCreate } from '@state/persons';
import { cardFlyIn } from '@utils/animations/card-fly-in';
import { SeoService } from '@services/seo.service';
import { LoadArticlePage } from '@state/articles/actions/article.actions';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [cardFlyIn],
})
export class OverviewComponent implements OnInit, OnDestroy {
  data$: Observable<AppArticle[]> = this.store.select('articles', 'activePageArticles');
  length$: Observable<number> = this.store.select('articles', 'articleAmount');
  isLoading$: Observable<boolean> = this.store.select('articles', 'isLoading');
  pageIndex$: Observable<number> = this.store.select('articles', 'pageIndex');
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
    seo: SeoService
  ) {
    seo.setTags('Artikel', 'Was gibt es Neues bei der RöSeNa?', undefined, '/articles/overview');
  }

  ngOnInit() {
    this.store.dispatch(new LoadArticlePage({ limit: this.limit }));
  }

  ngOnDestroy() {
    this.sub.unsubscribeComponent$.next();
  }
}
