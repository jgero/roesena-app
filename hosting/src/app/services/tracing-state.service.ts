import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class TracingStateService {
  get $isLoading(): Observable<boolean> {
    return this.$isLoadingCounter.pipe(map((i) => i > 0));
  }
  private $isLoadingCounter = new BehaviorSubject<number>(0);
  $snackbarMessage = new BehaviorSubject<string>("");

  constructor(private snackbar: MatSnackBar) {
    this.$snackbarMessage.subscribe({
      next: (message) => {
        if (message !== "") {
          this.snackbar.open(message, "OK");
        }
      },
    });
  }

  addLoading(): void {
    this.$isLoadingCounter.next(this.$isLoadingCounter.getValue() + 1);
  }

  completeLoading(): void {
    this.$isLoadingCounter.next(this.$isLoadingCounter.getValue() - 1);
  }
}
