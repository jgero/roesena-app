import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay, filter, switchMap, tap } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";

import { AuthService } from "src/app/services/auth.service";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { environment } from "src/environments/environment";
import { SwUpdate } from "@angular/service-worker";

@Component({
  selector: "app-root",
  templateUrl: "./root.component.html",
  styleUrls: ["./root.component.scss"],
})
export class RootComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );
  $badgeContentStream: Observable<number>;
  version: string;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public auth: AuthService,
    eventDAO: EventDALService,
    private snackbar: MatSnackBar,
    private swUpdate: SwUpdate
  ) {
    this.version = environment.buildVersion;
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
      map((vals) => (vals.length > 0 ? vals.length : null)),
      tap((unresponded) => {
        if (unresponded) {
          snackbar
            .open(`Unbeantwortete Termine: ${unresponded}`, "ANTWORTEN")
            .onAction()
            .subscribe({ next: () => this.router.navigate(["auth", "my-events"]) });
        }
      })
    );
  }

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.snackbar
          .open("Ein update für die App ist bereit", "UPDATE")
          .onAction()
          .subscribe(() => location.reload());
      });
    }
  }

  onHelpClick() {
    // navigate to the current route and add the 'help' prefix
    this.router.navigate([`/help${this.router.url}`]);
  }
}
