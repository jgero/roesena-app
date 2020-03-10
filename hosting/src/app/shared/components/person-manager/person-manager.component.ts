import { Component, Input, Output, EventEmitter, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-person-manager",
  templateUrl: "./person-manager.component.html",
  styleUrls: ["./person-manager.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersonManagerComponent),
      multi: true
    }
  ]
})
export class PersonManagerComponent implements ControlValueAccessor {
  public $persons: Observable<{ id: string; name: string }[]>;
  public isDisabled = false;

  @Input()
  public value: { id: string; amount: number }[] = [];
  @Output()
  public valueChange = new EventEmitter<{ id: string; amount: number }[]>();

  private propagateChange: (_: any) => {};
  private propagateTouch: () => {};

  constructor(firestore: AngularFirestore) {
    this.$persons = firestore
      .collection<{ name: string; authLevel: number }>("persons")
      .get()
      .pipe(map(el => el.docs.map(doc => ({ id: doc.id, name: doc.data().name }))));
  }

  public toggleId(id: string) {
    if (this.isDisabled) return;
    const selectedIndex = this.value.findIndex(el => el.id === id);
    if (selectedIndex >= 0) {
      this.value.splice(selectedIndex, 1);
    } else {
      this.value.push({ id, amount: -1 });
    }
    this.valueChange.emit(this.value);
    this.propagateChange(this.value);
    this.propagateTouch();
  }

  public isSelected(id: string): boolean {
    return !!this.value.find(el => id === el.id);
  }

  writeValue(obj: any): void {
    if (!obj) return;
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.propagateTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
