import { Component } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  $isLoading = new BehaviorSubject<boolean>(false);
  constructor(public auth: AuthService, private router: Router) {}

  public onSubmit(val: any) {
    this.$isLoading.next(true);
    this.auth.login(val.email, val.password).subscribe({
      next: _ => {
        this.$isLoading.next(false);
        this.router.navigate(["auth"]);
      },
      error: err => {
        this.$isLoading.next(false);
        console.log(err);
      }
    });
  }
}
