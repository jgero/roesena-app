import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { appImage } from "src/app/utils/interfaces";
import { Observable, zip } from "rxjs";
import { switchMap, map, tap } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { Details } from "src/app/utils/ui-abstractions";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent extends Details implements OnInit {
  $data: Observable<appImage>;
  $url: Observable<string>;
  constructor(public route: ActivatedRoute, public imageDAO: ImageDalService, router: Router, auth: AuthService) {
    super("images", route, router, imageDAO, auth);
  }

  ngOnInit() {
    this.$url = this.imageDAO.getDownloadURL(this.route.snapshot.paramMap.get("id"));
    super.ngOnInit();
  }
}
