import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrls: ["./auth-page.component.scss"]
})
export class AuthPageComponent implements OnDestroy {
  private sub: Subscription;
  constructor(public auth: AuthService, router: Router) {
    this.sub = this.auth.$user.subscribe(el => {
      if (!el) {
        router.navigate(["auth", "login"]);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
