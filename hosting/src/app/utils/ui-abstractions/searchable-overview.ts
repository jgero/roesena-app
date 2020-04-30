import { OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import { Overview } from "./overview";
import { DAL } from "../interfaces";
import { AuthService } from "src/app/services/auth.service";

export abstract class SearchableOverview extends Overview implements OnDestroy {
  private paramSub: Subscription;
  searchString = "";
  get searchTags(): string[] {
    return this.searchString.split(",").map((tag) => tag.trim());
  }
  constructor(private routeBase: string[], DAO: DAL, public route: ActivatedRoute, public router: Router, auth: AuthService) {
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
      this.$data = this.DAO.getBySearchStrings(this.searchTags);
    } else {
      this.$data = this.DAO.getAll();
    }
  }

  onSearchClick() {
    if (this.searchString) {
      this.router.navigate([...this.routeBase, this.searchString]);
    } else {
      this.router.navigate([...this.routeBase]);
    }
  }

  ngOnDestroy() {
    this.paramSub.unsubscribe();
  }
}
