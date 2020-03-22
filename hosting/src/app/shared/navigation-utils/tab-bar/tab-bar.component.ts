import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-tab-bar",
  templateUrl: "./tab-bar.component.html",
  styleUrls: ["./tab-bar.component.scss"]
})
export class TabBarComponent implements OnInit {
  @Input()
  navItems: { label: string; route: string }[] = [];

  constructor() {}

  ngOnInit(): void {}
}
