import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  private sub: Subscription;
  constructor(public auth: AuthService, private location: Location, private router: Router) {
    this.sub = this.auth.$user.pipe(filter((el) => !!el)).subscribe({
      next: () => this.goBack(),
    });
  }

  ngOnInit() {
    if (this.auth.$user.getValue()) {
      this.goBack();
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  private goBack() {
    if ((this.location.getState() as any).navigationId > 1) {
      this.location.back();
    } else {
      this.router.navigate([""]);
    }
  }

  public onSubmit(val: any) {
    this.auth.login(val.email, val.password).subscribe();
  }
}
