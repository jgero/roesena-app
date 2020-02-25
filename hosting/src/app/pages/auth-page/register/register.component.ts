import { Component, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnDestroy {
  registerForm = new FormGroup({
    name: new FormControl(""),
    email: new FormControl(""),
    password: new FormControl("")
  });
  private sub: Subscription;
  constructor(public auth: AuthService, private router: Router) {
    this.sub = this.auth.$user.subscribe(el => {
      if (el) {
        router.navigate(["auth"]);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public onSubmit() {
    this.auth
      .register(this.registerForm.value.email, this.registerForm.value.password)
      .subscribe({ next: el => this.router.navigate(["auth"]), error: el => console.log(el) });
  }
}
