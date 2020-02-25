import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "../../services/auth.service";
import { LoadingService } from "src/app/shared/services/loading.service";

@Component({
  selector: "app-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrls: ["./auth-page.component.scss"]
})
export class AuthPageComponent {
  constructor(public auth: AuthService, private router: Router, private loading: LoadingService) {}

  public logout() {
    this.loading.$isLoading.next(true);
    this.auth.logout().subscribe({
      next: _ => {
        this.loading.$isLoading.next(false);
        this.router.navigate(["auth", "login"]);
      },
      error: err => {
        this.loading.$isLoading.next(false);
        console.log(err);
      }
    });
  }
}
