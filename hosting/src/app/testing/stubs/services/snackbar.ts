import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from "@angular/material/snack-bar";

export class MatSnackBarStub {
  constructor() {}

  open(a: string, b: string): { onAction: () => Observable<void> } {
    // return new MatSnackBarRef(null, null);
    return { onAction: () => new Observable<void>((obs) => obs.complete()) };
  }
}
