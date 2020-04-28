import { Observable, of } from "rxjs";

export class MatSnackBarStub {
  constructor() {}
  open(a: string, b: string): Observable<void> {
    return of();
  }
}
