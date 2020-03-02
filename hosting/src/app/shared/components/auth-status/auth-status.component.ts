import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-auth-status",
  templateUrl: "./auth-status.component.html",
  styleUrls: ["./auth-status.component.scss"]
})
export class AuthStatusComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}
}
