import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  constructor(public auth: AuthService, private router: Router) {}

  public onSubmit(val: any) {
    this.auth.register(val.email, val.password, val.name).subscribe({
      next: () => this.router.navigate(["auth"]),
    });
  }
}
