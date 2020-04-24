import { Component, OnInit, Input, AfterViewChecked, ChangeDetectorRef } from "@angular/core";
import { GardeDef } from "src/app/utils/interfaces";
import { trigger, state, style, transition, animate } from "@angular/animations";

@Component({
  selector: "app-garde-table",
  templateUrl: "./garde-table.component.html",
  styleUrls: ["./garde-table.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class GardeTableComponent implements OnInit {
  @Input()
  defs: GardeDef[];
  public readonly columnsToDisplay = ["Jahr", "Garde-Titel", "Showtanz", "Leitung", "images-link"];
  public readonly columnKeys = ["year", "title", "show", "leaders"];
  expandedElement: GardeDef | null;

  constructor() {}

  ngOnInit() {
    this.expandedElement = this.defs[0];
  }
}
