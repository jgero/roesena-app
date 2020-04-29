import { OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";

import { appElement, appElementDAL, paginatedDAL } from "../interfaces";
import { Direction } from "../enums";
import { AuthService } from "src/app/services/auth.service";

abstract class Overview {
  $data: Observable<appElement[]>;
  get cols(): number {
    return Math.ceil(window.innerWidth / 500);
  }

  constructor(public DAO: appElementDAL, public auth: AuthService) {}

  initDataStream() {
    this.$data = this.DAO.getAll();
  }

  canCreate(): boolean {
    const user = this.auth.$user.getValue();
    // owner and admins can edit
    return user && (user.groups.includes("Autor") || user.groups.includes("admin"));
  }
}

export abstract class SearchableOverview extends Overview implements OnDestroy {
  private paramSub: Subscription;
  searchString = "";
  get searchTags(): string[] {
    return this.searchString.split(",").map((tag) => tag.trim());
  }
  constructor(
    private routeBase: string,
    DAO: appElementDAL,
    public route: ActivatedRoute,
    public router: Router,
    auth: AuthService
  ) {
    super(DAO, auth);
  }

  initDataStream() {
    this.searchString = this.route.snapshot.paramMap.get("searchString");
    this.updateDataStream();
    this.paramSub = this.route.paramMap.subscribe((map) => {
      this.searchString = map.get("searchString");
      this.updateDataStream();
    });
  }

  updateDataStream() {
    if (this.searchString) {
      this.$data = this.DAO.getByTags(this.searchTags);
    } else {
      this.$data = this.DAO.getAll();
    }
  }

  onSearchClick() {
    if (this.searchString) {
      this.router.navigate([this.routeBase, "overview", this.searchString]);
    } else {
      this.router.navigate([this.routeBase, "overview"]);
    }
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }
}

export abstract class PaginatedOverview extends SearchableOverview {
  $dataLength: Observable<number>;
  get limit(): number {
    return this.cols * 3;
  }
  pageIndex: number = 0;

  constructor(routeBase: string, public DAO: paginatedDAL, route: ActivatedRoute, router: Router, auth: AuthService) {
    super(routeBase, DAO, route, router, auth);
  }

  initDataStream() {
    this.$dataLength = this.DAO.getDocCount();
    super.initDataStream();
  }

  updateDataStream() {
    if (this.searchString) {
      this.$data = this.DAO.getByTags(this.searchTags);
    } else {
      this.$data = this.DAO.getPage(this.limit, Direction.initial);
    }
  }

  onPage(ev: PageEvent) {
    if (ev.pageIndex !== ev.previousPageIndex) {
      this.$data = this.DAO.getPage(this.limit, ev.pageIndex > ev.previousPageIndex ? Direction.forward : Direction.back);
      this.pageIndex = ev.pageIndex;
    }
  }
}
