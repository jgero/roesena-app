import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

@Injectable({
  providedIn: "root",
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

  addItem(event: MatChipInputEvent, form: AbstractControl) {
    let value = event.value.trim();
    if (value !== "" && !form.value.includes(value)) {
      (form.value as string[]).push(value);
      form.markAsDirty();
    }
    event.input.value = "";
  }
}
