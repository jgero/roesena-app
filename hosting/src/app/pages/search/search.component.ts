import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import {
  AddSearchString,
  ChangeDataType,
  CleanSearch,
  InitSearch,
  RemoveSearchString,
  RunSearch,
  SearchActions,
} from '@state/searching/actions/search.actions';
import { SubscriptionService } from '@services/subscription.service';
import { map, takeUntil, tap, take, withLatestFrom, filter } from 'rxjs/operators';
import { cardFlyIn } from '@utils/animations/card-fly-in';
import { SeoService } from '@services/seo.service';
import { AutocompleteService } from '@services/autocomplete.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { tagProposals } from '@state/searching/selectors/search.selectors';
import { ROUTER_NAVIGATED } from '@ngrx/router-store';
import { ofType, Actions } from '@ngrx/effects';
import { maxResultsPerPage } from '@state/searching/reducers/search.reducer';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [cardFlyIn],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchStrings$ = this.store.select('search', 'searchStrings');
  pageIndex$ = this.store.select('search', 'pageIndex');
  length$ = this.store.select('search', 'searchLength');
  events$ = this.store.select('search', 'events');
  images$ = this.store.select('search', 'images');
  articles$ = this.store.select('search', 'articles');
  searchTypeAmount$ = this.store.select('search', 'dataTypes').pipe(
    tap((types) => {
      setTimeout(() => {
        this.isArticlesChecked = !!types.includes('articles');
        this.isImagesChecked = !!types.includes('images');
        this.isEventsChecked = !!types.includes('events');
        if (types.length > 1) {
          this.heading = 'Suchergebnisse';
        } else {
          switch (types[0]) {
            case 'events':
              this.heading = 'Events';
              break;
            case 'articles':
              this.heading = 'Artikel';
              break;
            case 'images':
              this.heading = 'Bilder';
              break;
          }
        }
      });
    }),
    map((el) => el.length)
  );
  tagProposals$ = this.store.select(tagProposals);
  isArticlesChecked = false;
  isImagesChecked = false;
  isEventsChecked = false;
  heading = 'Suchergebnisse';
  readonly limit = maxResultsPerPage;
  @ViewChild('chipInput')
  chipInput: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    seo: SeoService,
    public autocomplete: AutocompleteService,
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
      const types: string[] = state.router.state.params.type.split(',');
      // init checkbox state
      this.isEventsChecked = types.includes('events');
      this.isArticlesChecked = types.includes('articles');
      this.isImagesChecked = types.includes('images');
      // init heading
      if (types.length > 1) {
        this.heading = 'Suchergebnisse';
      } else {
        switch (types[0]) {
          case 'events':
            this.heading = 'Events';
            break;
          case 'articles':
            this.heading = 'Artikel';
            break;
          case 'images':
            this.heading = 'Bilder';
            break;
        }
      }
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

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }

  onAddTag(event: MatAutocompleteSelectedEvent, input: HTMLInputElement) {
    input.value = '';
    this.store.dispatch(new AddSearchString({ searchString: event.option.value }));
  }

  onAddProposal(tag: string) {
    this.store.dispatch(new AddSearchString({ searchString: tag }));
  }

  onRemoveTag(searchString: string) {
    this.store.dispatch(new RemoveSearchString({ searchString }));
  }

  onCheckboxChange() {
    const dataTypes: string[] = [];
    if (this.isArticlesChecked) {
      dataTypes.push('articles');
    }
    if (this.isImagesChecked) {
      dataTypes.push('images');
    }
    if (this.isEventsChecked) {
      dataTypes.push('events');
    }
    this.store.dispatch(new ChangeDataType({ dataTypes }));
    this.store.dispatch(new RunSearch());
  }

  swtichToSingleType(type: string) {
    this.store.dispatch(new ChangeDataType({ dataTypes: [type] }));
    this.store.dispatch(new RunSearch());
  }

  onClearSearch() {
    this.store.dispatch(new CleanSearch());
  }

  onSearch() {
    if (this.chipInput.nativeElement.value !== '') {
      this.store.dispatch(new AddSearchString({ searchString: this.chipInput.nativeElement.value }));
      this.chipInput.nativeElement.value = '';
    }
    this.store.dispatch(new RunSearch());
  }
}
