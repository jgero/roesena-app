import { Component } from "@angular/core";
import { LoadingService } from "src/app/shared/services/loading.service";
import { AuthService } from "src/app/services/auth.service";
import { Observable } from "rxjs";
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from "rxjs/operators";

@Component({
  selector: "app-auth-level-manager",
  templateUrl: "./auth-level-manager.component.html",
  styleUrls: ["./auth-level-manager.component.scss"]
})
export class AuthLevelManagerComponent {
  dropdownItems = [
    { value: 0, label: "Gast" },
    { value: 1, label: "Mitglied" },
    { value: 2, label: "Gruppenleiter" },
    { value: 3, label: "Präsidium" },
    { value: 4, label: "Admin" }
  ];
  constructor(public auth: AuthService, private loading: LoadingService, private firestore: AngularFirestore) {}
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

  updateAuthLevel(id: string, level: number) {
    this.loading.incLoading();
    this.auth.updateAuthLevel(id, level).subscribe({
      next: () => this.loading.decLoading(),
      error: err => console.log(err)
    });
  }
}
