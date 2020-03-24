import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";

@Component({
  selector: "app-tag-input",
  templateUrl: "./tag-input.component.html",
  styleUrls: ["./tag-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true
    }
  ]
})
export class TagInputComponent implements ControlValueAccessor {
  @Input()
  value: string[] = [];
  @Output()
  valueChange = new EventEmitter<string[]>();

  // this will be set to the register on change callback function
  propagateChange: (_: any) => {};
  propagateTouch: () => {};

  constructor() {}

  addTag(tag: string) {
    this.value.push(tag);
    this.valueChange.emit(this.value);
    if (this.propagateChange) {
      this.propagateChange(this.value);
    }
  }

  popTag(tag: string) {
    this.value = this.value.filter(t => t !== tag);
    this.valueChange.emit(this.value);
    if (this.propagateChange) {
      this.propagateChange(this.value);
    }
  }

  onTouch() {
    if (this.propagateTouch) {
      this.propagateTouch();
    }
  }

  writeValue(obj: string[]): void {
    this.value = obj;
    this.valueChange.emit(this.value);
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }
}
