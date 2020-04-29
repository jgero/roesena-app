import { BreakpointState } from "@angular/cdk/layout";
import { of, Observable, ReplaySubject } from "rxjs";

export class BreakpointObserverStub {
  private br = new ReplaySubject<BreakpointState>();
  constructor() {
    this.br.next({ matches: false, breakpoints: {} });
  }

  observe(a: any): Observable<BreakpointState> {
    return this.br.asObservable();
  }
}
