import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  forwardRef
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements AfterViewInit, ControlValueAccessor {
  @ViewChild("input")
  inputRef: ElementRef<HTMLInputElement>;
  public isValid: boolean = true;
  @Input()
  label: string = "";
  @Input()
  value: string = "";
  @Input()
  required: boolean = false;
  @Input()
  pattern: string = ".*";
  @Input()
  disabled: boolean = false;
  @Input()
  type: string = "text";
  @Output()
  valueChange = new EventEmitter<string>();

  // this will be set to the register on change callback function
  propagateChange: (_: any) => {};
  propagateTouch: () => {};

  constructor(public cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.isValid = this.inputRef.nativeElement.checkValidity();
    this.cdr.detectChanges();
  }

  onChange() {
    this.isValid = this.inputRef.nativeElement.checkValidity();
    this.value = this.inputRef.nativeElement.value;
    this.propagateChange(this.value);
  }

  writeValue(obj: string): void {
    if (obj) {
      this.inputRef.nativeElement.value = obj;
      this.isValid = this.inputRef.nativeElement.checkValidity();
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
