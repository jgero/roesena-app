import { ReplaySubject } from 'rxjs';
import { ParamMap, Params, convertToParamMap } from '@angular/router';

/**
 * An ActivateRoute test double with a `paramMap` observable.
 * Use the `setParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();
  private initialMap: ParamMap;
  private data: any;

  public snapshot: any;

  constructor(initialParams?: Params, data?: any) {
    this.setParamMap(initialParams);
    this.initialMap = convertToParamMap(initialParams);
    this.snapshot = {
      paramMap: {
        get: (a: string) => {
          return this.initialMap.get(a);
        },
      },
      queryParamMap: {
        get: (a: string) => {
          return this.initialMap.get(a);
        },
      },
      data,
    };
  }

  /** The mock paramMap observable */
  readonly paramMap = this.subject.asObservable();

  // readonly snapshot =

  /** Set the paramMap observables's next value */
  setParamMap(params?: Params) {
    this.subject.next(convertToParamMap(params));
  }
}
