import { Component, HostBinding } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"]
})
export class NavBarComponent {
  constructor(public auth: AuthService, private router: Router) {}

  @HostBinding("class.visible") isVisible = true;

  public logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(["/"]);
      }
    });
  }
}
