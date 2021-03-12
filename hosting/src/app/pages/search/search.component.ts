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
} from '@state/searching/actions/search.actions';
import { SubscriptionService } from '@services/subscription.service';
import { map, takeUntil, tap } from 'rxjs/operators';
import { cardFlyIn } from '@utils/animations/card-fly-in';
import { SeoService } from '@services/seo.service';
import { AutocompleteService } from '@services/autocomplete.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [cardFlyIn],
})
export class SearchComponent implements OnInit, OnDestroy {
  searchStrings$ = this.store.select('search', 'searchStrings');
  events$ = this.store.select('search', 'events');
  images$ = this.store.select('search', 'images');
  articles$ = this.store.select('search', 'articles');
  searchTypeAmount$ = this.store.select('search', 'dataTypes').pipe(
    tap((types) => {
      setTimeout(() => {
        this.isArticlesChecked = !!types.includes('articles');
        this.isImagesChecked = !!types.includes('images');
        this.isEventsChecked = !!types.includes('events');
      });
    }),
    map((el) => el.length)
  );
  isArticlesChecked = false;
  isImagesChecked = false;
  isEventsChecked = false;
  get cols(): number {
    return Math.ceil(this.hostRef.nativeElement.clientWidth / 370);
  }
  get limit(): number {
    return this.cols * 5;
  }
  @ViewChild('chipInput')
  chipInput: ElementRef<HTMLInputElement>;

  constructor(
    private store: Store<State>,
    private subs: SubscriptionService,
    private hostRef: ElementRef<HTMLElement>,
    seo: SeoService,
    public autocomplete: AutocompleteService
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
    this.store.dispatch(new InitSearch({ limit: this.limit }));
  }

  ngOnDestroy() {
    this.subs.unsubscribeComponent$.next();
  }

  onAddTag(event: MatAutocompleteSelectedEvent, input: HTMLInputElement) {
    input.value = '';
    this.store.dispatch(new AddSearchString({ searchString: event.option.value }));
  }

  onRemoveTag(searchString: string) {
    this.store.dispatch(new RemoveSearchString({ searchString }));
  }

  onCheckboxChange() {
    const dataTypes: string[] = [];
    if (this.isArticlesChecked) dataTypes.push('articles');
    if (this.isImagesChecked) dataTypes.push('images');
    if (this.isEventsChecked) dataTypes.push('events');
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
