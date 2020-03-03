import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../../services/auth.service";
import { LoadingService } from "src/app/shared/services/loading.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent {
  constructor(public auth: AuthService, private router: Router, private load: LoadingService) {}

  public onSubmit(val: any) {
    this.load.$isLoading.next(true);
    this.auth.register(val.email, val.password, val.name).subscribe({
      next: _ => {
        this.load.$isLoading.next(false);
        this.router.navigate(["auth"]);
      },
      error: err => {
        this.load.$isLoading.next(false);
        console.log(err);
      }
    });
  }
}
