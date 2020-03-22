import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
  @Input()
  $isLoading: Observable<boolean>;
}
