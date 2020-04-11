import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { appArticle } from "src/app/utils/interfaces";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"]
})
export class DetailComponent {
  article: appArticle;

  constructor(route: ActivatedRoute, public auth: AuthService) {
    this.article = route.snapshot.data.appArticle;
  }
}
