import { Component, Input, forwardRef, Output, EventEmitter } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements ControlValueAccessor {
  @Input()
  items: { value: any; label: string }[] = [];
  @Input()
  label = "";
  activeIndex = 0;
  @Input()
  set value(arg: any) {
    const index = this.items.findIndex(el => el.value === arg);
    if (index < 0) throw new Error("set dropdown to invalid value");
    this.activeIndex = index;
  }
  get value(): any {
    return this.items[this.activeIndex].value;
  }
  @Output()
  valueChange = new EventEmitter<any>();
  // this will be set to the register on change callback function
  propagateChange: (_: any) => {};
  propageteTouch: () => {};

  onChange(val: any) {
    if (val === this.value) return;
    this.value = val;
    this.propagateChange(val);
    this.valueChange.emit(val);
  }

  writeValue(obj: any): void {
    if (!obj) return;
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.propageteTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }

  constructor() {}
}
