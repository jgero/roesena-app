import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TracingStateService {
  $isLoading = new BehaviorSubject<boolean>(false);
  $snackbarMessage = new BehaviorSubject<string>("");
}
