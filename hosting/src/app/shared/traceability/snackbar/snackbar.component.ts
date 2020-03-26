import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { inOutAnimation } from "src/app/utils/animations";

@Component({
  selector: "app-snackbar",
  templateUrl: "./snackbar.component.html",
  styleUrls: ["./snackbar.component.scss"],
  animations: [inOutAnimation]
})
export class SnackbarComponent implements OnInit, OnDestroy {
  @Input()
  message: Observable<string>;
  @Output()
  confirm = new EventEmitter<boolean>();
  private sub: Subscription;
  $data = new BehaviorSubject<{ message: string; isVisible: boolean }>({ message: "", isVisible: false });

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.sub = this.message.subscribe(msg => {
      if (msg === "") return;
      this.$data.next({ message: msg, isVisible: true });
      // for some reason angular is not detecting changes here
      this.cdr.detectChanges();
      setTimeout(() => {
        this.$data.next({ message: "", isVisible: false });
        this.confirm.emit(false);
        this.cdr.detectChanges();
      }, 5000);
    });
  }

  onConfirm() {
    this.$data.next({ message: "", isVisible: false });
    this.confirm.emit(true);
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
