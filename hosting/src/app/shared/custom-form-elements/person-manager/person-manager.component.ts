import { Component, Input, Output, EventEmitter, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-person-manager",
  templateUrl: "./person-manager.component.html",
  styleUrls: ["./person-manager.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersonManagerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: PersonManagerComponent,
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
  @Input()
  mustContainCurrentUser = false;

  private propagateChange: (_: any) => {};
  private propagateTouch: () => {};

  constructor(personsDAO: PersonDalService, public auth: AuthService) {
    this.$persons = personsDAO.getPersonsStream();
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

  validate({ value }: FormControl) {
    if (!this.mustContainCurrentUser) return { invalid: false };
    if (!value) return { invalid: true };
    return (
      !((value as { id: string; amount: number }[]).findIndex(el => el.id === this.auth.$user.getValue().id) >= 0) && {
        invalid: true
      }
    );
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
