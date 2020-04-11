import { Component } from "@angular/core";
import { Observable } from "rxjs";

import { appPerson } from "src/app/utils/interfaces";
import { AuthService } from "src/app/services/auth.service";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";

@Component({
  selector: "app-auth-level-manager",
  templateUrl: "./auth-level-manager.component.html",
  styleUrls: ["./auth-level-manager.component.scss"],
})
export class AuthLevelManagerComponent {
  dropdownItems = [
    { value: false, label: "Nein" },
    { value: true, label: "Ja" },
  ];
  private persons: Observable<appPerson[]>;

  constructor(public auth: AuthService, private personsDAO: PersonDalService) {}

  public get $persons(): Observable<appPerson[]> {
    if (this.persons) return this.persons;
    this.persons = this.personsDAO.getPersonsStream();
    return this.persons;
  }

  updatePerson(id: string, isConfirmedMember: boolean, groups: string[]) {
    console.log(id, isConfirmedMember, groups);
    return this.personsDAO.update(id, { isConfirmedMember, groups } as appPerson).subscribe();
  }
}
