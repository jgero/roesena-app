import { Component, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AutocompleteService } from 'src/app/services/autocomplete.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  AddSearchString,
  RemoveSearchString,
  RunSearch,
  CleanSearch,
  ChangeDataType,
} from '@state/searching/actions/search.actions';
import { State } from '@state/state.module';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  isOpen = false;
  searchStrings$: Observable<string[]> = this.store.select('search', 'searchStrings');
  @ViewChild('chipInput')
  chipInput: ElementRef<HTMLInputElement>;

  constructor(private store: Store<State>, public autocomplete: AutocompleteService) {}

  toggleSearch() {
    this.isOpen = !this.isOpen;
  }

  onAddTag(event: MatAutocompleteSelectedEvent, input: HTMLInputElement) {
    input.value = '';
    this.store.dispatch(new AddSearchString({ searchString: event.option.value }));
  }

  onRemoveTag(searchString: string) {
    this.store.dispatch(new RemoveSearchString({ searchString }));
  }

  onClearSearch() {
    this.store.dispatch(new CleanSearch());
  }

  onSearch() {
    this.store.dispatch(new ChangeDataType({ dataTypes: ['articles', 'events', 'images'] }));
    if (this.chipInput.nativeElement.value !== '') {
      this.store.dispatch(new AddSearchString({ searchString: this.chipInput.nativeElement.value }));
      this.chipInput.nativeElement.value = '';
    }
    this.store.dispatch(new RunSearch());
    this.isOpen = false;
  }
}
