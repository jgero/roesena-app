import { Component } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AutocompleteService } from 'src/app/services/autocomplete.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AddSearchString, RemoveSearchString, RunSearch } from '@state/searching/actions/search.actions';
import { State } from '@state/state.module';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  searchStrings$: Observable<string[]> = this.store.select('search', 'searchStrings');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isHelpVisible = false;

  constructor(public store: Store<State>, public autocomplete: AutocompleteService) {}

  onAddTag(event: MatAutocompleteSelectedEvent, input: HTMLInputElement) {
    input.value = '';
    this.store.dispatch(new AddSearchString({ searchString: event.option.value }));
  }

  onRemoveTag(searchString: string) {
    this.store.dispatch(new RemoveSearchString({ searchString }));
  }

  onSearch() {
    this.store.dispatch(new RunSearch());
  }
}
