import { Component, HostBinding } from "@angular/core";

import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"]
})
export class NavBarComponent {
  constructor(public auth: AuthService) {}

  @HostBinding("class.visible") isVisible = true;

  public logout() {
    this.isVisible = false;
    this.auth.logout().subscribe({
      next: () => {
        location.reload();
      }
    });
  }
}
