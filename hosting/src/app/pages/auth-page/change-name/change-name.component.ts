import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-change-name",
  templateUrl: "./change-name.component.html",
  styleUrls: ["./change-name.component.scss"]
})
export class ChangeNameComponent {
  constructor(public auth: AuthService) {}

  updateOwnName(val: any) {
    // this.loading.incLoading();
    this.auth.updateOwnName(val.newName).subscribe({
      // next: () => this.loading.decLoading(),
      error: err => console.log(err)
    });
  }
}
