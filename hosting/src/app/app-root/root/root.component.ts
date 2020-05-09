import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay, filter, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'src/app/services/auth.service';
import { EventDALService } from 'src/app/services/DAL/event-dal.service';
import { environment } from 'src/environments/environment';
import { SwUpdate } from '@angular/service-worker';
import { MatSidenav, MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
})
export class RootComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    tap((el) => (this.brakpointMatches = el)),
    shareReplay()
  );
  brakpointMatches: boolean;
  $badgeContentStream: Observable<number>;
  isLoading = false;
  version: string;

  @ViewChild('drawer')
  private sidenav: MatDrawer;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public auth: AuthService,
    private eventDAO: EventDALService,
    private snackbar: MatSnackBar,
    private swUpdate: SwUpdate
  ) {
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart:
          this.isLoading = true;
          break;
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:
          this.isLoading = false;
          this.closeNav();
          break;
      }
    });
  }

  openNav() {
    this.sidenav.open();
  }

  closeNav() {
    // only close sidenav if its in mobile mode
    if (this.brakpointMatches) {
      this.sidenav.close();
    }
  }

  ngOnInit() {
    this.version = environment.buildVersion;
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        this.snackbar
          .open('Ein Update für die App ist bereit', 'UPDATE')
          .onAction()
          .subscribe(() => location.reload());
      });
    }
    this.$badgeContentStream = this.auth.$user.pipe(
      // listen to user updates and only trigger on new users
      filter((val) => !!val),
      // then request events
      switchMap(() => this.eventDAO.getRespondables()),
      // filter out events that are already responded
      map((vals) => {
        const id = this.auth.$user.getValue().id;
        return vals.filter((val) => val.participants.find((paricipant) => paricipant.id === id).amount < 0);
      }),
      // only keep the amount of events
      map((vals) => (vals.length > 0 ? vals.length : null)),
      tap((unresponded) => {
        if (unresponded !== null) {
          this.snackbar
            .open(`Unbeantwortete Termine: ${unresponded}`, 'ANTWORTEN')
            .onAction()
            .subscribe({ next: () => this.router.navigate(['auth', 'my-events']) });
        }
      })
    );
  }
}
