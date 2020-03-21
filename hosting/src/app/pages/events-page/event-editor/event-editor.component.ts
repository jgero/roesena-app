import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { AuthService } from "src/app/services/auth.service";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { appEvent } from "src/app/utils/interfaces";

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
  private subs: Subscription[] = [];

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private eventDAL: EventDALService
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
    const updated: appEvent = {
      id: this.route.snapshot.paramMap.get("id") ? this.route.snapshot.paramMap.get("id") : "",
      title,
      description,
      authLevel,
      startDate: this.getDateFromDateAndTimeStrings(startDate, startTime),
      endDate: this.getDateFromDateAndTimeStrings(endDate, endTime),
      participants,
      // keep old owner id if there is one
      ownerId: this.initData.ownerId === "" ? this.auth.$user.getValue().id : this.initData.ownerId
    };
    const action = this.route.snapshot.paramMap.get("id") ? this.eventDAL.update(updated) : this.eventDAL.insert(updated);
    this.subs.push(
      action.subscribe({
        next: () => {
          this.router.navigate(["events"]);
        }
      })
    );
  }

  public deleteEvent(): void {
    this.subs.push(
      this.eventDAL.delete(this.route.snapshot.paramMap.get("id")).subscribe({
        next: () => {
          this.router.navigate(["events"]);
        }
      })
    );
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
