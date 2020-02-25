import { Component, OnDestroy } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "../../../services/auth.service";
import { LoadingService } from "src/app/shared/services/loading.service";

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
  constructor(public auth: AuthService, private router: Router, private load: LoadingService) {
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
    this.load.$isLoading.next(true);
    this.auth.register(this.registerForm.value.email, this.registerForm.value.password).subscribe({
      next: _ => {
        this.load.$isLoading.next(false);
        this.router.navigate(["auth"]);
      },
      error: el => {
        this.load.$isLoading.next(false);
        console.log(el);
      }
    });
  }
}
