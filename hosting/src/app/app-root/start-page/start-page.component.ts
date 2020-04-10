import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";

import { appEvent, appArticle } from "../../utils/interfaces";
import { EventDALService } from "src/app/services/DAL/event-dal.service";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";

@Component({
  selector: "app-start-page",
  templateUrl: "./start-page.component.html",
  styleUrls: ["./start-page.component.scss"]
})
export class StartPageComponent {
  public eventCards: Observable<appEvent[]>;
  public articleCards: Observable<appArticle[]>;

  constructor(eventDAO: EventDALService, articleDAO: ArticleDalService) {
    this.eventCards = eventDAO.getNextPublicEvents();
    this.articleCards = articleDAO.getLatestArticles();
    // this.eventCards = route.snapshot.data.appEvent;
    // console.log("i am constructed");
  }
}
