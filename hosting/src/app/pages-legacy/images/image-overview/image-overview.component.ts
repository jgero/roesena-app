import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription } from "rxjs";

import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { appImage } from "src/app/utils/interfaces";

@Component({
  selector: "app-image-overview",
  templateUrl: "./image-overview.component.html",
  styleUrls: ["./image-overview.component.scss"]
})
export class ImageOverviewComponent implements OnDestroy {
  $images: Observable<appImage[]>;
  searchString: string = "";
  descending: boolean;
  private sub: Subscription;

  constructor(route: ActivatedRoute, public imageDAO: ImageDalService) {
    this.sub = route.paramMap.subscribe(paramMap => {
      const s = paramMap.get("searchString");
      if (!s) return;
      this.searchString = s;
    });
    this.$images = imageDAO.getImages();
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
