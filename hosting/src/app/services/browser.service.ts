import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class BrowserService {
  constructor() {}

  reload() {
    location.reload();
  }
}
