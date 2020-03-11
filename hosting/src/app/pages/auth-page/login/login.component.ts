import { Component } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { LoadingService } from "src/app/shared/services/loading.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  constructor(public auth: AuthService, private router: Router, private loading: LoadingService) {}

  public onSubmit(val: any) {
    this.loading.incLoading();
    this.auth.login(val.email, val.password).subscribe({
      next: _ => {
        this.loading.decLoading();
        this.router.navigate(["auth"]);
      },
      error: err => {
        this.loading.decLoading();
        console.log(err);
      }
    });
  }
}
