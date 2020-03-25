import { Component } from "@angular/core";
import { appArticle } from "src/app/utils/interfaces";
import { ActivatedRoute, Router } from "@angular/router";

import { ArticleDalService } from "src/app/services/DAL/article-dal.service";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"]
})
export class EditorComponent {
  article: appArticle;
  isNew: boolean;

  constructor(route: ActivatedRoute, private router: Router, private articleDAO: ArticleDalService) {
    if (route.snapshot.paramMap.get("id")) {
      this.isNew = false;
      this.article = route.snapshot.data.appArticle;
    } else {
      this.isNew = true;
      this.article = {
        content: "",
        created: new Date(),
        id: "",
        ownerId: "",
        tags: [],
        title: ""
      };
    }
  }

  onSubmit({ title, content, tags }: any) {
    this.article.tags = tags;
    this.article.content = content;
    this.article.title = title;
    (this.isNew ? this.articleDAO.insert(this.article) : this.articleDAO.update(this.article)).subscribe({
      next: () => this.router.navigate(["articles", "overview"])
    });
  }

  onDelete() {
    this.articleDAO.delete(this.article.id).subscribe({ next: () => this.router.navigate(["articles", "overview"]) });
  }
}
