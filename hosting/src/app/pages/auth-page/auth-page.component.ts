import { Component } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrls: ["./auth-page.component.scss"]
})
export class AuthPageComponent {
  navItems = [
    { label: "Meine Termine", route: "/auth/my-events" },
    { label: "Name ändern", route: "/auth/rename" },
    { label: "Berechtigungs Manager", route: "/auth/auth-level-manager" }
  ];
  constructor(public auth: AuthService) {}
}
