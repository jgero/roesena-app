import { OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";

import { appElement, appElementDAL } from "./interfaces";
import { Direction } from "./enums";

export abstract class Overview implements OnDestroy {
  readonly routeBase: string;
  private paramSub: Subscription;
  searchString = "";
  get searchTags(): string[] {
    return this.searchString.split(",").map((tag) => tag.trim());
  }
  $data: Observable<appElement[]>;
  $dataLength: Observable<number>;
  get limit(): number {
    return this.cols * 3;
  }
  pageIndex: number = 0;
  get cols(): number {
    return Math.ceil(window.innerWidth / 500);
  }

  constructor(private DAO: appElementDAL, private router: Router, route: ActivatedRoute, routeBase: string) {
    this.routeBase = routeBase;
    this.$dataLength = DAO.getDocCount();

    const initialSearchString = route.snapshot.paramMap.get("searchString");
    if (initialSearchString) {
      this.searchString = initialSearchString;
      this.$data = DAO.getByTags(this.searchTags);
    } else {
      this.$data = DAO.getPage(this.limit, Direction.initial, []);
    }
    this.paramSub = route.paramMap.subscribe((map) => {
      this.searchString = map.get("searchString");
      if (this.searchString) {
        // this.searchString = initialSearchString;
        this.$data = DAO.getByTags(this.searchTags);
      } else {
        this.$data = DAO.getPage(this.limit, Direction.initial);
      }
    });
  }

  onPage(ev: PageEvent) {
    if (ev.pageIndex !== ev.previousPageIndex) {
      this.$data = this.DAO.getPage(this.limit, ev.pageIndex > ev.previousPageIndex ? Direction.forward : Direction.back);
      this.pageIndex = ev.pageIndex;
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
