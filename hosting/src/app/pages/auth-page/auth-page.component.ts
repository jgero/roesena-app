import { Component, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";

import { AuthService } from "../../services/auth.service";
import { LoadingService } from "src/app/shared/services/loading.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Component({
  selector: "app-auth-page",
  templateUrl: "./auth-page.component.html",
  styleUrls: ["./auth-page.component.scss"]
})
export class AuthPageComponent {
  public dropdownItems = [
    { value: 0, label: "Gast" },
    { value: 1, label: "Mitglied" },
    { value: 2, label: "Gruppenleiter" },
    { value: 3, label: "Präsidium" },
    { value: 4, label: "Admin" }
  ];
  constructor(public auth: AuthService, private firestore: AngularFirestore, private loading: LoadingService) {}
  private persons: Observable<{ name: string; id: string; authLevel: number }[]>;

  public get $persons(): Observable<{ name: string; id: string; authLevel: number }[]> {
    if (this.persons) return this.persons;
    this.persons = this.firestore
      .collection<{ name: string; authLevel: number }>("persons")
      .snapshotChanges()
      .pipe(
        map(action =>
          action.map(val => ({
            name: val.payload.doc.data().name,
            id: val.payload.doc.id,
            authLevel: val.payload.doc.data().authLevel
          }))
        )
      );
    return this.persons;
  }

  debug(arg: any) {
    console.log(arg);
  }

  public updateOwnName(val: any) {
    this.loading.$isLoading.next(true);
    this.auth.updateOwnName(val.newName).subscribe({
      next: () => this.loading.$isLoading.next(false),
      error: err => console.log(err)
    });
  }

  public updateAuthLevel(id: string, level: number) {
    this.loading.$isLoading.next(true);
    this.auth.updateAuthLevel(id, level).subscribe({
      next: () => this.loading.$isLoading.next(false),
      error: err => console.log(err)
    });
  }

  public getAuthLevelText(): string {
    const user = this.auth.$user.getValue();
    if (user) {
      switch (user.authLevel) {
        case 0:
          return "Gast";
        case 1:
          return "Mitglied";
        case 2:
          return "Gruppenleiter/Elferrat";
        case 3:
          return "Präsidium";
        case 4:
          return "Admin";
        default:
          return "Fehler";
      }
    } else {
      return "";
    }
  }
}
