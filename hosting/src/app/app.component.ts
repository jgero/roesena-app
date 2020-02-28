import { Component, HostBinding } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { LoadingService } from "./shared/services/loading.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(public auth: AuthService, public loading: LoadingService) {}
}
