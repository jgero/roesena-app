import { Component, HostBinding, OnDestroy } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { LoadingService } from "./shared/services/loading.service";
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router, RouterEvent, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterOutlet } from '@angular/router';
import { routeAnimation } from './utils/animations';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  animations: [routeAnimation]
})
export class AppComponent implements OnDestroy {
  $isLoading = new BehaviorSubject<boolean>(false);
  private sub: Subscription;
  constructor(public auth: AuthService, router: Router) {
    this.sub = router.events.subscribe((ev: RouterEvent) => {
      if (ev instanceof NavigationStart) {
        this.$isLoading.next(true);
      }
      if (ev instanceof NavigationEnd || ev instanceof NavigationCancel || ev instanceof NavigationError) {
        this.$isLoading.next(false);
      }
    });
  }
  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
