import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from "@angular/core";
import { Observable, Subscription, BehaviorSubject } from "rxjs";
import { trigger, transition, style, animate } from "@angular/animations";

@Component({
  selector: "app-snackbar",
  templateUrl: "./snackbar.component.html",
  styleUrls: ["./snackbar.component.scss"],
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ transform: "translateY(100%)", opacity: 0 }),
        animate("0.2s ease-out", style({ transform: "translateY(0)", opacity: 1 }))
      ]),
      transition(":leave", [
        style({ transform: "translateY(0)", opacity: 1 }),
        animate("0.2s ease-out", style({ transform: "translateY(100%)", opacity: 0 }))
      ])
    ])
  ]
})
export class SnackbarComponent implements OnInit, OnDestroy {
  @Input()
  message: Observable<string>;
  @Output()
  confirm = new EventEmitter<boolean>();
  private sub: Subscription;
  $data = new BehaviorSubject<{ message: string; isVisible: boolean }>({ message: "", isVisible: false });

  constructor() {}

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
