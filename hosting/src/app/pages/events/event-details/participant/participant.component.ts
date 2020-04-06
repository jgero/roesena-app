import { Component, OnInit, Input, HostBinding, HostListener } from "@angular/core";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { PersonDalService } from "src/app/services/DAL/person-dal.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-participant",
  templateUrl: "./participant.component.html",
  styleUrls: ["./participant.component.scss"],
})
export class ParticipantComponent implements OnInit {
  @Input()
  participant: { id: string; amount: number };
  @HostBinding("class") classes = "";
  @HostListener("click")
  onClick() {
    // if it's the users own name navigate to the responding page
    if (this.auth.$user.getValue().id === this.participant.id) {
      this.router.navigate(["auth", "my-events"]);
    }
  }

  $data: Observable<{ name: string; amount: number }>;

  constructor(private router: Router, private auth: AuthService, private personDAO: PersonDalService) {}

  ngOnInit(): void {
    // this.classes = this.auth.$user.getValue().id === this.participant.id ? "me" : "other";
    this.$data = this.personDAO.getPersonById(this.participant.id).pipe(
      map((val) => {
        return { name: val.name, amount: this.participant.amount };
      }),
      tap(() => {
        if (this.participant.amount > 0) {
          this.classes = this.auth.$user.getValue().id === this.participant.id ? "me accepted" : "accepted";
          // this.classes.concat(" accepted");
        } else if (this.participant.amount === 0) {
          this.classes = this.auth.$user.getValue().id === this.participant.id ? "me rejected" : "rejected";
          // this.classes.concat(" rejected");
        } else {
          this.classes = this.auth.$user.getValue().id === this.participant.id ? "me pending" : "pending";
          // this.classes.concat(" pending");
        }
      })
    );
    // this.$data = this.firestore
    //   .collection("persons")
    //   .doc(this.participant.id)
    //   .get()
    //   .pipe(map((doc) => ({ name: doc.data().name, amount: this.participant.amount })));
  }

  // @HostBinding("class") classes: string = "loading";
}
