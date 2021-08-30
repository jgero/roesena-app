import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { InitSearch, SearchActions } from '@state/searching/actions/search.actions';
import { SubscriptionService } from '@services/subscription.service';
import { map, takeUntil, take, withLatestFrom, filter } from 'rxjs/operators';
import { SeoService } from '@services/seo.service';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { ofType, Actions } from '@ngrx/effects';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  isSingleType$ = this.store.select('search', 'dataTypes').pipe(map((el) => el.length === 1));

  openCarouselWithId$ = new Subject<string>();

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    seo: SeoService,
    private actions$: Actions<SearchActions>
  ) {
    this.store.pipe(takeUntil(this.subs.unsubscribe$)).subscribe((state) => {
      seo.setTags(
        'Suchergebnisse',
        `Ergebnisse zur Suche nach: ${state.search.searchStrings.join(', ')}`,
        undefined,
        state.router.state.url
      );
    });
  }

  ngOnInit(): void {
    // initialize when landing on the search page
    this.store.pipe(take(1)).subscribe((state) => {
      const tags: string[] = state.router.state.params.searchStrings ? state.router.state.params.searchStrings.split(',') : [];
      const types: string[] = state.router.state.params.type.split(',') || [];
      // init search
      this.store.dispatch(
        new InitSearch({
          types,
          tags,
        })
      );
    });
    // react on route changes
    this.actions$
      .pipe(
        ofType(ROUTER_NAVIGATED),
        withLatestFrom(this.store),
        takeUntil(this.subs.unsubscribe$),
        // only act when there are differences between route and search config to avoid infinite loops
        filter(([action, store]) => {
          const searchTags = store.search.searchStrings;
          const searchTypes = store.search.dataTypes;
          const tags: string[] = store.router.state.params.searchStrings
            ? store.router.state.params.searchStrings.split(',')
            : [];
          const types: string[] = store.router.state.params.type.split(',');
          // if types and tags have the same length
          if (searchTypes.length === types.length && searchTags.length === tags.length) {
            // if all tag and types are the same
            if (tags.every((tag) => searchTags.includes(tag)) && types.every((t) => searchTypes.includes(t))) {
              return false;
            }
          }
          return true;
        })
      )
      .subscribe(([action, store]) => {
        const tags: string[] = store.router.state.params.searchStrings.split(',');
        const types: string[] = store.router.state.params.type.split(',');
        // only dispatch if there are differences
        this.store.dispatch(
          new InitSearch({
            types,
            tags,
          })
        );
      });
  }

  onImageClick(id: string) {
    this.openCarouselWithId$.next(id);
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }
}
