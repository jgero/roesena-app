import { Component, HostBinding, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-change-name",
  templateUrl: "./change-name.component.html",
  styleUrls: ["./change-name.component.scss"]
})
export class ChangeNameComponent implements OnDestroy {
  @HostBinding("class") classes = "card";
  private sub: Subscription;
  constructor(public auth: AuthService) {}

  updateOwnName(val: any) {
    this.sub = this.auth.updateOwnName(val.newName).subscribe();
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
