import { Component, Input, OnInit, ChangeDetectorRef, OnDestroy, ChangeDetectionStrategy } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { fadeInOut } from "src/app/utils/animations";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
  animations: [fadeInOut],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent implements OnInit, OnDestroy {
  @Input()
  $isLoading: Observable<boolean>;
  @Input()
  fullscreen = true;
  private sub: Subscription;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.sub = this.$isLoading.subscribe({
      next: () => {
        // for some reason angular is very weird and only updates the loading indicator when this is called in a timeout here
        setTimeout(() => this.cdr.detectChanges());
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
