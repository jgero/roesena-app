import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

import { ChipsInputService } from 'src/app/services/chips-input.service';
import { AutocompleteService } from 'src/app/services/autocomplete.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

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

  searchForm: FormGroup = new FormGroup({
    searchStrings: new FormControl(),
  });

  @ViewChild('chipInput') chipInput: ElementRef<HTMLInputElement>;

  constructor(public chips: ChipsInputService, public autocomplete: AutocompleteService) {}

  addItemByAutocomplete(event: MatAutocompleteSelectedEvent) {
    const value = event.option.value.trim();
    const form = this.searchForm.get('searchStrings');
    if (value !== '' && !form.value.includes(value)) {
      (form.value as string[]).push(value);
      form.markAsDirty();
    }
    this.chipInput.nativeElement.value = '';
  }

  onSubmit() {
    this.search.emit(this.searchForm.get('searchStrings').value);
  }
}
