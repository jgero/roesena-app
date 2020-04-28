import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

export class MatSnackBarStub {
  constructor() {}
  open(a: string, b: string): { onAction: () => Observable<void> } {
    return { onAction: () => new Observable((observer) => observer.complete()) };
  }
}
