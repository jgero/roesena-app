import { Router } from "@angular/router";
import { Component } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay, filter, switchMap } from "rxjs/operators";

import { AuthService } from "src/app/services/auth.service";
import { EventDALService } from "src/app/services/DAL/event-dal.service";

@Component({
  selector: "app-root",
  templateUrl: "./root.component.html",
  styleUrls: ["./root.component.scss"],
})
export class RootComponent {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );
  $badgeContentStream: Observable<number>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public auth: AuthService,
    eventDAO: EventDALService
  ) {
    this.$badgeContentStream = auth.$user.pipe(
      // listen to user updates and only trigger on new users
      filter((val) => !!val),
      // then request events
      switchMap(() => eventDAO.getRespondables()),
      // filter out events that are already responded
      map((vals) => {
        const id = this.auth.$user.getValue().id;
        return vals.filter((val) => val.participants.find((paricipant) => paricipant.id === id).amount < 0);
      }),
      // only keep the amount of events
      map((vals) => (vals.length > 0 ? vals.length : null))
    );
  }

  onHelpClick() {
    // navigate to the current route and add the 'help' prefix
    this.router.navigate([`/help${this.router.url}`]);
  }
}
