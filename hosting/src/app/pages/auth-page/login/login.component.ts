import { Component, OnDestroy } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnDestroy {
  // add form controls and validation checks
  loginForm = new FormGroup({
    email: new FormControl(""),
    password: new FormControl("")
  });
  private sub: Subscription;
  constructor(public auth: AuthService, router: Router) {
    this.sub = this.auth.$user.subscribe(el => {
      if (el) {
        router.navigate(["auth"]);
      }
    });
  }

  public onSubmit() {
    this.auth.login(this.loginForm.value.email, this.loginForm.value.password);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
