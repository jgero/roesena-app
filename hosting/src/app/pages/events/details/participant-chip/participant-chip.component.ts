import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { Router } from "@angular/router";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { Observable } from "rxjs";
import { appPerson } from "src/app/utils/interfaces";

@Component({
  selector: "app-participant-chip",
  templateUrl: "./participant-chip.component.html",
  styleUrls: ["./participant-chip.component.scss"],
})
export class ParticipantChipComponent implements OnInit {
  @Input()
  color: string;
  @Input()
  value: { id: string; amount: number };
  $person: Observable<appPerson>;

  constructor(public auth: AuthService, public router: Router, private personDAO: PersonDalService) {}

  ngOnInit(): void {
    this.$person = this.personDAO.getPersonStreamById(this.value.id);
  }

  onParticipantClick(id: string) {
    if (id === this.auth.$user.getValue().id) {
      this.router.navigate(["/auth/my-events"]);
    }
  }
}
