import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TracingStateService {
  $isLoading = new BehaviorSubject<number>(0);
  $snackbarMessage = new BehaviorSubject<string>("");

  constructor() {
    this.$isLoading.subscribe(el => console.log(el));
  }

  addLoading(): void {
    this.$isLoading.next(this.$isLoading.getValue() + 1);
  }

  completeLoading(): void {
    this.$isLoading.next(this.$isLoading.getValue() - 1);
  }
}
