import { OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";

import { appElement, appElementDAL } from "./interfaces";

export abstract class SearchableComponent implements OnDestroy {
  readonly routeBase: string;
  searchString = "";
  paramSub: Subscription;
  $data: Observable<appElement[]>;

  constructor(private DAO: appElementDAL, private router: Router, route: ActivatedRoute, routeBase: string) {
    this.routeBase = routeBase;
    const initialSearchString = route.snapshot.paramMap.get("searchString");
    if (initialSearchString) {
      this.searchString = initialSearchString;
      this.runSearch();
    } else {
      this.$data = DAO.getAll();
    }
    this.paramSub = route.paramMap.subscribe((map) => {
      const searchString = map.get("searchString");
      if (searchString) {
        this.searchString = searchString;
        this.runSearch();
      }
    });
  }

  private runSearch() {
    const tags = this.searchString.trim().split(" ");
    this.$data = this.DAO.getByTags(tags);
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
