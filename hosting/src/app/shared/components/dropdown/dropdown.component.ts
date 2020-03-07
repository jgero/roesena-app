import {
  Component,
  OnInit,
  Input,
  forwardRef,
  Output,
  EventEmitter,
  AfterViewInit,
  ChangeDetectorRef,
  AfterViewChecked
} from "@angular/core";
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
export class DropdownComponent implements AfterViewChecked, ControlValueAccessor {
  @Input()
  items: { value: any; label: string }[] = [];
  @Input()
  label = "";
  activeIndex = 0;
  @Input()
  set value(arg: any) {
    // debugger;
    const index = this.items.findIndex(el => el.value === arg);
    if (index < 0) throw new Error("set dropdown to invalid value");
    this.activeIndex = index;
    if (this.propagateChange) this.propagateChange(this.items[index].value);
    this.valueChange.emit(this.items[index].value);
  }
  get value(): any {
    // debugger;
    return this.items[this.activeIndex].value;
  }
  @Output()
  valueChange = new EventEmitter<any>();

  // this will be set to the register on change callback function
  propagateChange: (_: any) => {};

  writeValue(obj: any): void {
    if (obj) {
      this.value = obj;
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
    this.value = this.items[0].value;
  }
  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error("Method not implemented.");
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewChecked(): void {
    this.value = this.value;
    this.cdr.detectChanges();
  }
}
