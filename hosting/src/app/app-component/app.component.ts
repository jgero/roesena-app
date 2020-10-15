import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { ROUTER_REQUEST } from '@ngrx/router-store';
import { Store } from '@ngrx/store';
import { pageTransition } from '@utils/animations/page-transition';
import { Observable, Subject } from 'rxjs';
import { map, tap, shareReplay, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { State } from '@state/basePages/reducers/base.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [pageTransition],
})
export class AppComponent implements OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    tap((el) => (this.brakpointMatches = el)),
    shareReplay()
  );
  brakpointMatches: boolean;
  badgeContentStream$ = this.store.select('base', 'respondablesAmount').pipe(map((el) => (el === 0 ? undefined : el)));
  user$ = this.store.select('user', 'user');
  version: string;
  destroyed$ = new Subject<boolean>();

  @ViewChild('drawer')
  private sidenav: MatDrawer;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<State>,
    updates$: Actions,
    matIconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    fns: AngularFireFunctions
  ) {
    matIconRegistry.addSvgIcon('rsn', sanitizer.bypassSecurityTrustResourceUrl('assets/icon-inverted.svg'));
    this.version = environment.buildVersion;
    // close sidenav on navigation
    updates$
      .pipe(
        ofType(ROUTER_REQUEST),
        takeUntil(this.destroyed$),
        tap(() => this.closeNav())
      )
      .subscribe();

    // configure functions for local endpoint if needed
    if (environment.useEmulator) {
      fns.useFunctionsEmulator('http://localhost:5001');
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  closeNav() {
    // only close sidenav if its in mobile mode
    if (this.brakpointMatches) {
      this.sidenav.close();
    }
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}