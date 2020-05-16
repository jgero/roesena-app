import { Component } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { AutocompleteService } from 'src/app/services/autocomplete.service';
import { AppStore } from 'src/app/reducers';
import { addString, removeString, search } from 'src/app/actions/search.actions';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  searchStrings$: Observable<string[]> = this.store.select('search', 'searchStrings');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isHelpVisible = false;

  constructor(public store: Store<AppStore>, public autocomplete: AutocompleteService) {}

  onAddTag(event: MatAutocompleteSelectedEvent, input: HTMLInputElement) {
    input.value = '';
    this.store.dispatch(addString({ searchString: event.option.value }));
  }

  onRemoveTag(searchString: string) {
    this.store.dispatch(removeString({ searchString }));
  }

  onSearch() {
    this.store.dispatch(search());
  }
}
