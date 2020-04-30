import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { filter } from "rxjs/operators";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-reset",
  templateUrl: "./reset.component.html",
  styleUrls: ["./reset.component.scss"],
})
export class ResetComponent implements OnDestroy, OnInit {
  resetForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });
  newPasswordForm = new FormGroup({
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
  });
  public code: string;
  private subs: Subscription[] = [];

  constructor(private route: ActivatedRoute, private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.route.snapshot.queryParamMap.get("mode") === "resetPassword" && this.route.snapshot.queryParamMap.get("oobCode")) {
      this.code = this.route.snapshot.queryParamMap.get("oobCode");
    }
    this.subs.push(
      this.auth.$user.pipe(filter((el) => !!el)).subscribe({
        next: () => this.router.navigate([""]),
      })
    );
  }

  onResetSubmit() {
    this.subs.push(this.auth.sendResetPasswordMail(this.resetForm.get("email").value).subscribe());
  }

  onNewPasswordSubmit() {
    this.subs.push(
      this.auth.changePasswordWithResetCode(this.newPasswordForm.get("password").value, this.code).subscribe({
        next: () => this.router.navigate(["auth", "login"]),
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
