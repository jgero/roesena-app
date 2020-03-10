import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { LoadingService } from "src/app/shared/services/loading.service";

@Component({
  selector: "app-change-name",
  templateUrl: "./change-name.component.html",
  styleUrls: ["./change-name.component.scss"]
})
export class ChangeNameComponent {
  constructor(public auth: AuthService, private loading: LoadingService) {}

  updateOwnName(val: any) {
    this.loading.$isLoading.next(true);
    this.auth.updateOwnName(val.newName).subscribe({
      next: () => this.loading.$isLoading.next(false),
      error: err => console.log(err)
    });
  }
}
