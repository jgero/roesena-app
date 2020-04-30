import { ActivatedRoute, Router } from "@angular/router";
import { OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { appElement, DAL } from "../interfaces";
import { AuthService } from "src/app/services/auth.service";

export abstract class Details implements OnInit {
  $data: Observable<appElement>;

  constructor(
    public routeBase: string,
    public route: ActivatedRoute,
    public router: Router,
    public DAO: DAL,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.$data = this.DAO.getById(this.route.snapshot.paramMap.get("id")).pipe(
      tap((appEl) => {
        if (appEl === null) {
          this.router.navigate([this.routeBase, "overview"]);
        }
      })
    );
  }

  canEdit(appEl: appElement): boolean {
    const user = this.auth.$user.getValue();
    return user && (user.id === appEl.ownerId || user.groups.includes("admin"));
  }
}
