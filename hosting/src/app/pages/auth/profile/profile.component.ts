import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnDestroy {
  updateNameForm = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.pattern("^[a-zA-ZäöüÄÖÜ -]+$")]),
  });
  private subs: Subscription[] = [];
  constructor(public auth: AuthService) {}

  onUpdateNameSubmit() {
    this.subs.push(
      this.auth
        .updateName(this.auth.$user.getValue().id, this.updateNameForm.get("name").value)
        .subscribe({ next: () => this.updateNameForm.markAsPristine() })
    );
  }

  getErrorMessage(ctrl: AbstractControl): string {
    if (ctrl.getError("pattern")) return "Ungültiger Name";
    if (ctrl.getError("required")) return "Pflichtfeld";
    return "";
  }

  logout() {
    this.subs.push(
      this.auth.logout().subscribe({
        next: () => {
          location.reload();
        },
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
