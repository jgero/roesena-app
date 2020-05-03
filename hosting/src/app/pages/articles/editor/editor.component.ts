import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Component, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";

import { appArticle } from "src/app/utils/interfaces";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { ChipsInputService } from "src/app/services/chips-input.service";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnDestroy {
  readonly article: appArticle;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  articleForm: FormGroup;
  private subs: Subscription[] = [];

  constructor(
    private articleDAO: ArticleDalService,
    route: ActivatedRoute,
    private router: Router,
    public chips: ChipsInputService
  ) {
    this.article = route.snapshot.data.article;
    this.articleForm = new FormGroup({
      title: new FormControl(this.article.title, [Validators.required, Validators.maxLength(35)]),
      content: new FormControl(this.article.content, [Validators.required]),
      tags: new FormControl(this.article.tags),
    });
  }

  onSubmit() {
    this.articleForm.disable();
    let updated = this.article;
    updated.title = this.articleForm.get("title").value;
    updated.content = this.articleForm.get("content").value;
    updated.tags = this.articleForm.get("tags").value;
    const action = this.article.id
      ? // if id exists run update and mark form as clean
        this.articleDAO.update(updated).pipe(
          tap(() => {
            this.articleForm.enable();
            this.articleForm.markAsPristine();
          })
        )
      : // else inser the new doc and go to new editor page with created id
        this.articleDAO.insert(updated).pipe(tap((newId) => this.router.navigate(["articles", "edit", newId])));
    this.subs.push(action.subscribe(null, null, null));
  }

  deleteArticle(): void {
    this.subs.push(
      this.articleDAO.delete(this.article.id).subscribe({
        next: (success) => {
          if (success) this.router.navigate(["articles", "overview"]);
        },
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
