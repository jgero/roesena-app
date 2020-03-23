import { Component } from "@angular/core";
import { Observable } from "rxjs";

import { appPerson } from "src/app/utils/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";

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
  private persons: Observable<appPerson[]>;

  constructor(public auth: AuthService, private personsDAO: PersonDalService) {}

  public get $persons(): Observable<appPerson[]> {
    if (this.persons) return this.persons;
    this.persons = this.personsDAO.getPersonsStream();
    return this.persons;
  }

  updateAuthLevel(id: string, level: number) {
    this.auth.updateAuthLevel(id, level).subscribe();
  }
}
