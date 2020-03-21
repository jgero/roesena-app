import { Component, HostBinding, OnDestroy } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { BehaviorSubject, Subscription } from "rxjs";
import {
  Router,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterOutlet
} from "@angular/router";
import { routeAnimation } from "./utils/animations";
import { TracingStateService } from "./services/tracing-state.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [routeAnimation]
})
export class AppComponent implements OnDestroy {
  private sub: Subscription;
  constructor(public auth: AuthService, router: Router, public trace: TracingStateService) {
    // this.sub = router.events.subscribe((ev: RouterEvent) => {
    //   if (ev instanceof NavigationStart) {
    //     this.$isLoading.next(true);
    //   }
    //   if (ev instanceof NavigationEnd || ev instanceof NavigationCancel || ev instanceof NavigationError) {
    //     this.$isLoading.next(false);
    //   }
    // });
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData["animation"];
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
