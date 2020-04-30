import { ActivatedRoute, Router } from "@angular/router";
import { PageEvent } from "@angular/material/paginator";
import { Observable } from "rxjs";

import { Direction } from "../enums";
import { paginatedDAL } from "../interfaces";
import { SearchableOverview } from "./searchable-overview";
import { AuthService } from "src/app/services/auth.service";

export abstract class PaginatedOverview extends SearchableOverview {
  $dataLength: Observable<number>;
  get limit(): number {
    return this.cols * 3;
  }
  pageIndex: number = 0;

  constructor(routeBase: string[], public DAO: paginatedDAL, route: ActivatedRoute, router: Router, auth: AuthService) {
    super(routeBase, DAO, route, router, auth);
  }

  initDataStream() {
    this.$dataLength = this.DAO.getDocCount();
    super.initDataStream();
  }

  updateDataStream() {
    if (this.searchString) {
      this.$data = this.DAO.getBySearchStrings(this.searchTags);
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
