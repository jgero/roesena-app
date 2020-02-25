import { Component, OnInit, HostBinding, OnDestroy } from "@angular/core";
import { LoadingService } from "../../services/loading.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"]
})
export class LoadingComponent {}
