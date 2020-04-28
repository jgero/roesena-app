import { BreakpointState } from "@angular/cdk/layout";
import { of, Observable } from "rxjs";

export class BreakpointObserverStub {
  constructor() {}

  observe(a: any): Observable<BreakpointState> {
    return of({ matches: false, breakpoints: {} });
  }
}
