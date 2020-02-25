import { Component, OnInit, HostBinding } from "@angular/core";

@Component({
  selector: "app-nav-bar",
  templateUrl: "./nav-bar.component.html",
  styleUrls: ["./nav-bar.component.scss"]
})
export class NavBarComponent implements OnInit {
  public isVisible = true;
  constructor() {}

  @HostBinding("class.visible") get visible() {
    return this.isVisible;
  }

  ngOnInit(): void {}
}
