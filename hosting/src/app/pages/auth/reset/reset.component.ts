import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-reset",
  templateUrl: "./reset.component.html",
  styleUrls: ["./reset.component.scss"]
})
export class ResetComponent {
  hasCode = false;
  private code: string;

  constructor(route: ActivatedRoute, private auth: AuthService, private router: Router) {
    if (route.snapshot.queryParamMap.get("mode") === "resetPassword" && route.snapshot.queryParamMap.get("oobCode")) {
      this.hasCode = true;
      this.code = route.snapshot.queryParamMap.get("oobCode");
    }
  }

  sendResetMail({ email }) {
    this.auth.sendResetPasswordMail(email).subscribe();
  }

  updatePassword({ password }) {
    this.auth.changePasswordWithResetCode(password, this.code).subscribe({ next: () => this.router.navigate(["/auth/login"]) });
  }
}
