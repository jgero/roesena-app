import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { filter } from "rxjs/operators";

import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  constructor(public auth: AuthService, private location: Location) {
    this.auth.$user.pipe(filter(el => !!el)).subscribe({
      next: () => location.back()
    });
  }

  ngOnInit() {
    if (this.auth.$user.getValue()) {
      this.location.back();
    }
  }

  public onSubmit(val: any) {
    this.auth.login(val.email, val.password).subscribe();
  }
}
