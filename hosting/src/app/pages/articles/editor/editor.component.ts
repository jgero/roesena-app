import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, Subscription, of } from "rxjs";
import { appArticle } from "src/app/utils/interfaces";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { FormGroup, FormControl, Validators, AbstractControl } from "@angular/forms";
import { ArticleDalService } from "src/app/services/DAL/article-dal.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { tap, map, delay } from "rxjs/operators";
import { MatChipInputEvent } from "@angular/material/chips";
import { ChipsInputService } from "src/app/services/chips-input.service";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnDestroy, OnInit {
  $data: Observable<appArticle>;
  private article: appArticle;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  articleForm: FormGroup;
  private subs: Subscription[] = [];

  constructor(
    private articleDAO: ArticleDalService,
    private route: ActivatedRoute,
    private router: Router,
    public chips: ChipsInputService
  ) {}

  ngOnInit() {
    this.$data = this.route.data.pipe(
      map((routeData) => routeData.article),
      tap((article: appArticle) => {
        this.article = article;
        this.articleForm = new FormGroup({
          title: new FormControl(article.title, [Validators.required, Validators.maxLength(35)]),
          content: new FormControl(article.content, [Validators.required]),
          tags: new FormControl(article.tags),
        });
      })
    );
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
      this.articleDAO.delete(this.article.id).subscribe({ next: () => this.router.navigate(["articles", "overview"]) })
    );
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
