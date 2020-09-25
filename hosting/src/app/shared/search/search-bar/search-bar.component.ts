import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { AutocompleteService } from 'src/app/services/autocomplete.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  AddSearchString,
  RemoveSearchString,
  RunSearch,
  SearchActionTypes,
  InitSearch,
  ChangeDataType,
  CleanSearch,
} from '@state/searching/actions/search.actions';
import { State } from '@state/state.module';
import { Actions, ofType } from '@ngrx/effects';
import { MatRadioChange } from '@angular/material/radio';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  get isOpen(): boolean {
    return !!this.bottomSheet._openedBottomSheetRef;
  }

  constructor(private bottomSheet: MatBottomSheet, actions$: Actions, private store: Store<State>) {
    actions$.pipe(ofType(SearchActionTypes.AddSearchString, SearchActionTypes.RemoveSearchString)).subscribe({
      next: () => {
        if (!this.isOpen) {
          this.bottomSheet.open(SearchSheetComponent);
        }
      },
    });
  }

  toggleSheet() {
    if (this.isOpen) {
      this.bottomSheet.dismiss();
    } else {
      this.bottomSheet.open(SearchSheetComponent);
    }
  }
}

@Component({
  selector: 'app-search-sheet',
  templateUrl: 'search-sheet.html',
  styleUrls: ['./search-sheet.scss'],
})
export class SearchSheetComponent {
  searchStrings$: Observable<string[]> = this.store.select('search', 'searchStrings');
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isHelpVisible = false;
  options = ['Events', 'Artikel', 'Bilder'];
  selectedOption$ = this.store.select('search', 'dataType').pipe(
    map((dataType) => {
      switch (dataType) {
        case 'events':
          return 'Events';
        case 'articles':
          return 'Artikel';
        case 'images':
          return 'Bilder';
      }
    })
  );
  constructor(private bottomSheetRef: MatBottomSheet, private store: Store<State>, public autocomplete: AutocompleteService) {}

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

  onRadioChange(event: MatRadioChange) {
    let dataType: string;
    switch (event.value) {
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
    this.store.dispatch(new ChangeDataType({ dataType }));
  }

  onSearch() {
    this.store.dispatch(new RunSearch());
    this.bottomSheetRef.dismiss();
  }

  onClose() {
    this.bottomSheetRef.dismiss();
  }
}
