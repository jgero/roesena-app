import { Component, OnDestroy } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LoadingService } from "src/app/shared/services/loading.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  // add form controls and validation checks
  loginForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl("")
  });
  constructor(public auth: AuthService, private router: Router, private loading: LoadingService) {}

  public onSubmit() {
    this.loading.$isLoading.next(true);
    this.auth.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: _ => {
        this.loading.$isLoading.next(false);
        this.router.navigate(["/auth"]);
      },
      error: err => {
        this.loading.$isLoading.next(false);
        console.log(err);
      }
    });
  }
}
