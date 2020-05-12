import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormGroup, FormControl } from '@angular/forms';

import { ChipsInputService } from 'src/app/services/chips-input.service';
import { AutocompleteService } from 'src/app/services/autocomplete.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Input()
  set searchStrings(s: string[]) {
    this.searchForm = new FormGroup({
      searchStrings: new FormControl(s),
    });
  }
  get searchStrings(): string[] {
    return this.searchForm.get('searchStrings').value;
  }
  @Output()
  search = new EventEmitter<string[]>();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  isHelpVisible = false;

  searchForm: FormGroup = new FormGroup({
    searchStrings: new FormControl(),
  });

  constructor(public chips: ChipsInputService, public autocomplete: AutocompleteService) {}

  onSubmit() {
    this.search.emit(this.searchForm.get('searchStrings').value);
  }
}
