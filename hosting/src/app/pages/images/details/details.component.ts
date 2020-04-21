import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { appImage } from "src/app/utils/interfaces";
import { Observable, zip } from "rxjs";
import { switchMap, map, tap } from "rxjs/operators";

interface appImageWithUrl extends appImage {
  url: string;
}

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent {
  $image: Observable<appImageWithUrl>;
  constructor(route: ActivatedRoute, imageDAO: ImageDalService, router: Router) {
    this.$image = zip(
      imageDAO.getById(route.snapshot.paramMap.get("id")).pipe(
        tap((event) => {
          if (!event) {
            router.navigate(["images", "overview"]);
          }
        })
      ),
      imageDAO.getDownloadURL(route.snapshot.paramMap.get("id"))
    ).pipe(map((values) => ({ ...values[0], url: values[1] })));
  }
}
