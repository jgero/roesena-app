import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { State } from '@state/state.module';
import { Store } from '@ngrx/store';
import { maxResultsPerPage } from '@state/searching/reducers/search.reducer';

@Component({
  selector: 'app-single-type',
  templateUrl: './single-type.component.html',
  styleUrls: ['./single-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleTypeComponent {
  searchStrings$ = this.store.select('search', 'searchStrings');
  pageIndex$ = this.store.select('search', 'pageIndex');
  length$ = this.store.select('search', 'searchLength');
  events$ = this.store.select('search', 'events');
  images$ = this.store.select('search', 'images');
  articles$ = this.store.select('search', 'articles');
  readonly limit = maxResultsPerPage;

  @Output()
  imageClick = new EventEmitter<string>();

  constructor(private store: Store<State>) {}

  handleClick(id: string) {
    if (window.innerWidth > 600) {
      this.imageClick.emit(id);
    }
  }
}
