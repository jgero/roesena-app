import { Component } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AutocompleteService } from 'src/app/services/autocomplete.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AddSearchString, RemoveSearchString, RunSearch, SearchActionTypes } from '@state/searching/actions/search.actions';
import { State } from '@state/state.module';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  isOpen = false;
  constructor(private bottomSheet: MatBottomSheet, private actions$: Actions) {
    actions$.pipe(ofType(SearchActionTypes.AddSearchString, SearchActionTypes.RemoveSearchString)).subscribe({
      next: () => {
        if (!this.isOpen) {
          this.bottomSheet.open(SearchSheet);
          this.isOpen = true;
        }
      },
    });
  }

  toggleSheet() {
    if (this.isOpen) {
      this.bottomSheet.dismiss();
    } else {
      this.bottomSheet.open(SearchSheet);
    }
    this.isOpen = !this.isOpen;
  }
}

@Component({
  selector: 'search-sheet',
  templateUrl: 'search-sheet.html',
  styleUrls: ['./search-sheet.scss'],
})
export class SearchSheet {
  searchStrings$: Observable<string[]> = this.store.select('search', 'searchStrings');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isHelpVisible = false;
  options = ['Events', 'Artikel', 'Bilder'];
  selectedOption: string = 'Events';
  constructor(private store: Store<State>, public autocomplete: AutocompleteService) {}

  onAddTag(event: MatAutocompleteSelectedEvent, input: HTMLInputElement) {
    input.value = '';
    this.store.dispatch(new AddSearchString({ searchString: event.option.value }));
  }

  onRemoveTag(searchString: string) {
    this.store.dispatch(new RemoveSearchString({ searchString }));
  }

  onSearch() {
    let dataType: string;
    switch (this.selectedOption) {
      case 'Events':
        dataType = 'events';
        break;
      case 'Artikel':
        dataType = 'articles';
        break;
      case 'Bilder':
        dataType = 'images';
        break;
    }
    this.store.dispatch(new RunSearch({ dataType }));
  }
}
