import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent {
  constructor(public auth: AuthService, private router: Router) {}

  public onSubmit(val: any) {
    // this.load.incLoading();
    this.auth.register(val.email, val.password, val.name).subscribe({
      next: _ => {
        // this.load.decLoading();
        this.router.navigate(["auth"]);
      },
      error: err => {
        // this.load.decLoading();
        console.log(err);
      }
    });
  }
}
