import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class LoadingService {
  $isLoading = new BehaviorSubject<number>(0);
  constructor() {
    this.$isLoading.subscribe(el => console.log(el));
  }

  incLoading() {
    this.$isLoading.next(this.$isLoading.getValue() + 1);
  }

  decLoading() {
    this.$isLoading.next(this.$isLoading.getValue() - 1);
  }
}
