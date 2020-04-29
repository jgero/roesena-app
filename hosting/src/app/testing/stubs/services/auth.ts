import { BehaviorSubject } from "rxjs";
import { appPerson } from "src/app/utils/interfaces";

export class AuthServiceStub {
  $user = new BehaviorSubject<appPerson | null>(null);
  constructor() {}
}
