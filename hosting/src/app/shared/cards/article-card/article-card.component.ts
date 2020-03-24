import { Component, OnInit, Input } from "@angular/core";
import { appArticle } from "src/app/utils/interfaces";

@Component({
  selector: "app-article-card",
  templateUrl: "./article-card.component.html",
  styleUrls: ["./article-card.component.scss"]
})
export class ArticleCardComponent implements OnInit {
  @Input()
  article: appArticle;

  constructor() {}

  ngOnInit(): void {}
}
