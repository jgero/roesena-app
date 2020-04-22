import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { appImage } from "src/app/utils/interfaces";
import { Observable, zip } from "rxjs";
import { switchMap, map, tap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";

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
  constructor(route: ActivatedRoute, imageDAO: ImageDalService, router: Router, private auth: AuthService) {
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

  canEdit(image: appImage): boolean {
    const user = this.auth.$user.getValue();
    return user && (user.id === image.ownerId || user.groups.includes("admin"));
  }
}
