import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { appImage, appArticle } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { map } from "rxjs/operators";

@Component({
  selector: "app-common",
  templateUrl: "./common.component.html",
  styleUrls: ["./common.component.scss"],
})
export class CommonComponent {
  $imageData: Observable<appImage>;
  $textData: Observable<appArticle>;
  groupName: string;
  externalPageLink: string | null;

  constructor(route: ActivatedRoute, imageDAO: ImageDalService, articleDAO: ArticleDalService) {
    this.groupName = route.snapshot.data.groupName;
    this.externalPageLink = route.snapshot.data.externalPageLink;
    this.$imageData = imageDAO.getBySearchStrings([this.groupName, "Gruppenseite"], 1).pipe(map((val) => val[0]));
    this.$textData = articleDAO.getBySearchStrings([this.groupName, "Gruppenseite"], 1).pipe(map((val) => val[0]));
  }
}
