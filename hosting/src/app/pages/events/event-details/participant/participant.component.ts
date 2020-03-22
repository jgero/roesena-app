import { Component, OnInit, Input, HostBinding } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

@Component({
  selector: "app-participant",
  templateUrl: "./participant.component.html",
  styleUrls: ["./participant.component.scss"]
})
export class ParticipantComponent implements OnInit {
  @Input()
  participant: { id: string; amount: number };

  data: Observable<{ name: string; amount: number }>;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.data = this.firestore
      .collection("persons")
      .doc(this.participant.id)
      .get()
      .pipe(
        map(doc => ({ name: doc.data().name, amount: this.participant.amount })),
        tap(() => {
          if (this.participant.amount > 0) {
            this.classes = "accepted";
          } else if (this.participant.amount === 0) {
            this.classes = "rejected";
          } else {
            this.classes = "pending";
          }
        })
      );
  }

  @HostBinding("class") classes: string = "loading";
}
