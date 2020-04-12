import { Component, OnInit } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Observable, of } from "rxjs";
import { appEvent } from "src/app/utils/interfaces";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { ActivatedRoute } from "@angular/router";
import { tap } from "rxjs/operators";
import { MatChipInputEvent } from "@angular/material/chips";
import { FormControl, Validators, Form, FormGroup, AbstractControl } from "@angular/forms";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent {
  $data: Observable<appEvent>;
  event: appEvent;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  eventForm: FormGroup;

  constructor(eventDAO: EventDALService, route: ActivatedRoute) {
    const id = route.snapshot.paramMap.get("id");
    this.$data = (id ? eventDAO.getById(id) : of(null)).pipe(
      tap((ev) => {
        this.event = ev;
        this.eventForm = new FormGroup({
          title: new FormControl(this.event.title, [Validators.required]),
          description: new FormControl(this.event.description, []),
          startDate: new FormControl(this.event.startDate, [Validators.required]),
          startTime: new FormControl(
            `${this.event.startDate.getHours()}:${this.event.startDate.getMinutes().toString().padEnd(2, "0")}`,
            [Validators.required, Validators.pattern("^([01][0-9]|2[0-3]):([0-5][0-9])$")]
          ),
          endDate: new FormControl(this.event.endDate, [Validators.required]),
          endTime: new FormControl(
            `${this.event.endDate.getHours()}:${this.event.endDate.getMinutes().toString().padEnd(2, "0")}`,
            [Validators.required, Validators.pattern("^([01][0-9]|2[0-3]):([0-5][0-9])$")]
          ),
        });
      })
    );
  }

  getErrorMessage(ctrl: AbstractControl): string {
    console.log(ctrl);
    if (ctrl.hasError("matDatepickerParse")) {
      return "Datum ungültig";
    } else if (ctrl.hasError("pattern")) {
      return "Eingabe ungültig";
    } else {
      return "Pflichtfeld";
    }
  }

  removeTag(tag: string) {
    this.event.tags.splice(
      this.event.tags.findIndex((el) => el === tag),
      1
    );
  }

  addTag(event: MatChipInputEvent) {
    let value = event.value.trim();
    if (value !== "") {
      this.event.tags.push(event.value);
    }
    event.input.value = "";
  }
}
