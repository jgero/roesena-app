import { BehaviorSubject, of, Observable } from 'rxjs';
import { AppPerson } from 'src/app/utils/interfaces';

export class AuthServiceStub {
  $user = new BehaviorSubject<AppPerson | null>(null);
  constructor() {}

  login(a: string, b: string): Observable<null> {
    return new Observable((o) => {
      o.next(null);
      o.complete();
    });
  }
}
