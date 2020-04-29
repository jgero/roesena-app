import { Component, Input } from "@angular/core";
import { appArticle } from "src/app/utils/interfaces";

@Component({ selector: "app-article-card", template: "" })
export class ArticleCardStub {
  @Input() article: appArticle;
}
