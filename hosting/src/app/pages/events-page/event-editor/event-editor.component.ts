import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-event-editor",
  templateUrl: "./event-editor.component.html",
  styleUrls: ["./event-editor.component.scss"]
})
export class EventEditorComponent {
  initData = {
    title: "",
    description: "",
    authLevel: 0,
    startDate: this.getDateStringFromDate(new Date()),
    startTime: this.getTimeStringFromDate(new Date()),
    endDate: this.getDateStringFromDate(new Date()),
    endTime: this.getTimeStringFromDate(new Date()),
    participants: [],
    ownerId: ""
  };
  dropdownItems = [
    { value: 0, label: "Gäste" },
    { value: 1, label: "Mitglieder" },
    { value: 2, label: "Gruppenleiter" },
    { value: 3, label: "Präsidium" },
    { value: 4, label: "Admins" }
  ];
  title = "";

  constructor(
    private firestore: AngularFirestore,
    public route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    this.title = this.route.snapshot.paramMap.get("id") ? "Event bearbeiten" : "Event erstellen";
    if (this.route.snapshot.paramMap.get("id")) {
      // save already existing event in here so it can be edited
      const { title, description, authLevel, startDate, endDate, participants, ownerId } = route.snapshot.data.appEvent;
      this.initData = {
        title,
        description,
        authLevel,
        startDate: this.getDateStringFromDate(startDate),
        startTime: this.getTimeStringFromDate(startDate),
        endDate: this.getDateStringFromDate(endDate),
        endTime: this.getTimeStringFromDate(endDate),
        participants,
        ownerId
      };
    }
  }

  private getDateStringFromDate(d: Date): string {
    return `${d
      .getDate()
      .toString()
      .padStart(2, "0")}.${(d.getMonth() + 1).toString().padStart(2, "0")}.${d.getFullYear()}`;
  }

  private getTimeStringFromDate(d: Date): string {
    return `${d
      .getHours()
      .toString()
      .padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  public saveEvent({ title, description, authLevel, startDate, startTime, endDate, endTime, participants }: any): void {
    const updated = {
      title,
      description,
      authLevel,
      startDate: this.getDateFromDateAndTimeStrings(startDate, startTime),
      endDate: this.getDateFromDateAndTimeStrings(endDate, endTime),
      participants,
      // keep old owner id if there is one
      ownerId: this.initData.ownerId === "" ? this.auth.$user.getValue().id : this.initData.ownerId
    };
    console.log(updated);
    if (this.route.snapshot.paramMap.get("id")) {
      // update existing event here
      this.firestore
        .collection("events")
        .doc(this.route.snapshot.paramMap.get("id"))
        .update(updated);
    } else {
      // insert new event
      this.firestore.collection("events").add(updated);
    }
    this.router.navigate(["events"]);
  }

  // private idArrayToParticipants(ids: string[]): { id: string; amount: number }[] {
  //   return ids.map(id => {
  //     const amount = this.initData.participants.find(el => el.id === id)
  //       ? this.initData.participants.find(el => el.id === id).amount
  //       : -1;
  //     return { id, amount };
  //   });
  // }

  public deleteEvent(): void {
    this.firestore
      .collection("events")
      .doc(this.route.snapshot.paramMap.get("id"))
      .delete();
    this.router.navigate(["events"]);
  }

  private getDateFromDateAndTimeStrings(d: string, time: string): Date {
    let res = new Date();
    const dparts: number[] = d.split(".").map(el => parseInt(el));
    res.setDate(dparts[0]);
    res.setMonth(dparts[1] - 1);
    res.setFullYear(dparts[2]);
    const nparts: number[] = time.split(":").map(el => parseInt(el));
    res.setHours(nparts[0], nparts[1]);
    return res;
  }
}
