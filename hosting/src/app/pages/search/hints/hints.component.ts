import { Component, ChangeDetectionStrategy } from '@angular/core';
import { maxResultsPerPage } from '@state/searching/reducers/search.reducer';
import { combineLatest } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@state/state.module';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-hints',
  templateUrl: './hints.component.html',
  styleUrls: ['./hints.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintsComponent {
  readonly limit = maxResultsPerPage;
  isSearchLimited$ = combineLatest([
    this.store.select('search', 'events'),
    this.store.select('search', 'images'),
    this.store.select('search', 'articles'),
  ]).pipe(map((results) => results[0].length + results[1].length + results[2].length === this.limit));
  isSearchInvalid$ = combineLatest([this.store.select('search', 'searchStrings'), this.store.select('search', 'dataTypes')]).pipe(
    map(([searchStrings, dataTypes]) => searchStrings.length === 0 && dataTypes.length > 1)
  );
  hasNoResults$ = combineLatest([
    this.store.select('search', 'events'),
    this.store.select('search', 'images'),
    this.store.select('search', 'articles'),
  ]).pipe(map((results) => results[0].length + results[1].length + results[2].length === 0));

  constructor(private store: Store<State>) {}
}
