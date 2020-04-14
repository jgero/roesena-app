import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";

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

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, public auth: AuthService) {}

  onHelpClick() {
    // navigate to the current route and add the 'help' prefix
    this.router.navigate([`/help${this.router.url}`]);
  }
}
