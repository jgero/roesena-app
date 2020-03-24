import { Component, forwardRef, Input, Output, EventEmitter, OnInit, OnDestroy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { BehaviorSubject, Subscription } from "rxjs";

import { ImageDalService } from "src/app/services/DAL/image-dal.service";

@Component({
  selector: "app-file-input",
  templateUrl: "./file-input.component.html",
  styleUrls: ["./file-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileInputComponent),
      multi: true
    }
  ]
})
export class FileInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input()
  value: string = "";
  @Input()
  required: boolean = false;
  @Input()
  disabled: boolean = false;
  @Output()
  valueChange = new EventEmitter<string>();

  $imgSrc = new BehaviorSubject<string | null>(null);
  private sub: Subscription;

  // this will be set to the register on change callback function
  propagateChange: (_: any) => {};
  propagateTouch: () => {};

  constructor(private imageDAO: ImageDalService) {}

  ngOnInit() {
    if (this.value === "") return;
    this.sub = this.imageDAO.getDownloadURL(this.value).subscribe({ next: src => this.$imgSrc.next(src) });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  onChange(file: File | null) {
    if (!file) return;
    var fr = new FileReader();
    fr.onload = () => {
      this.$imgSrc.next(fr.result as string);
      if (this.propagateChange) this.propagateChange(fr.result as string);
      this.valueChange.emit(fr.result as string);
    };
    fr.readAsDataURL(file);
  }

  onTouch() {
    if (this.propagateTouch) this.propagateTouch();
  }

  writeValue(obj: string): void {
    if (!obj) return;
    this.value = obj;
    this.ngOnInit();
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
