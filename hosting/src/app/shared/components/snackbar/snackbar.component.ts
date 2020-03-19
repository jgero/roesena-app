import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { inOutAnimation } from 'src/app/utils/animations';

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

  constructor() { }

  ngOnInit(): void {
    this.sub = this.message.subscribe(msg => {
      this.$data.next({ message: msg, isVisible: true });
      setTimeout(() => {
        this.$data.next({ message: "", isVisible: false });
        this.confirm.emit(false);
      }, 5000);
    });
  }

  onConfirm() {
    this.$data.next({ message: "", isVisible: false });
    this.confirm.emit(true);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
