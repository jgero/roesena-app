import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { InitSearch } from '@state/searching/actions/search.actions';
import { SubscriptionService } from '@services/subscription.service';
import { cardFlyIn } from '@utils/animations';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  animations: [cardFlyIn],
})
export class SearchPageComponent implements OnInit, OnDestroy {
  events$ = this.store.select('search', 'events');
  images$ = this.store.select('search', 'images');
  articles$ = this.store.select('search', 'articles');
  rowHeight$ = this.store.select('search', 'images').pipe(map((images) => (images.length > 0 ? '450px' : '300px')));
  get cols(): number {
    return Math.ceil(window.innerWidth / 700);
  }
  get limit(): number {
    return this.cols * 5;
  }
  constructor(private store: Store<State>, private subs: SubscriptionService) {}

  ngOnInit(): void {
    this.store.dispatch(new InitSearch({ limit: this.limit }));
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
