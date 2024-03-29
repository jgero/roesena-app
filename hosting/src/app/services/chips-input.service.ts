import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import {  MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Injectable({
  providedIn: 'root',
})
export class ChipsInputService {
  constructor() {}

  removeItem(item: string, form: AbstractControl) {
    (form.value as string[]).splice(
      (form.value as string[]).findIndex((el) => el === item.trim()),
      1
    );
    form.markAsDirty();
  }

  addItem(event: MatChipInputEvent, form: AbstractControl, autocomplete?: MatAutocompleteTrigger) {
    const value = event.value.trim();
    // only add if no autocomplete is provided or nothing is selected
    if (!autocomplete || (autocomplete && autocomplete.activeOption === null)) {
      if (new RegExp('^[0-9a-zA-ZäöüÄÖÜß -]+$').test(value) && !form.value.includes(value)) {
        (form.value as string[]).push(value);
        form.markAsDirty();
      }
    }
    event.input.value = '';
  }

  addSelected(event: MatAutocompleteSelectedEvent, form: AbstractControl, itemInput: HTMLInputElement) {
    const value = event.option.value;
    if (value !== '' && !form.value.includes(value)) {
      (form.value as string[]).push(value);
      // debugger;
      form.markAsDirty();
    }
    event.option.deselect();
    itemInput.value = '';
  }
}
