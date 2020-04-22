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

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnDestroy {
  $data: Observable<appArticle>;
  private article: appArticle;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  articleForm: FormGroup;
  private subs: Subscription[] = [];

  constructor(private articleDAO: ArticleDalService, route: ActivatedRoute, private auth: AuthService, private router: Router) {
    const id = route.snapshot.paramMap.get("id");
    this.$data = (id
      ? this.articleDAO.getArticleById(id).pipe(
          tap((article) => {
            if (!article) {
              this.router.navigate(["articles", "overview"]);
            }
          })
        )
      : of<appArticle>({ id: "", title: "", content: "", ownerId: this.auth.$user.getValue().id, created: new Date(), tags: [] })
    ).pipe(
      tap((article: appArticle) => {
        if (article === null) return;
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
      ? this.articleDAO.update(updated).pipe(
          tap(() => {
            this.articleForm.enable();
            this.articleForm.markAsPristine();
          })
        )
      : this.articleDAO.insert(updated).pipe(tap((newId) => this.router.navigate(["articles", "edit", newId])));
    // save
    // when saving worked the query in constructor will fire again, reset the form and event can be saved again, becaus id will then be set
    this.subs.push(action.subscribe(null, null, null));
  }

  deleteArticle(): void {
    this.subs.push(
      this.articleDAO.delete(this.article.id).subscribe({ next: () => this.router.navigate(["articles", "overview"]) })
    );
  }

  getErrorMessage(ctrl: AbstractControl): string {
    if (ctrl.hasError("maxlength")) return "Eingabe zu lang";
    if (ctrl.hasError("required")) return "Pflichtfeld";
    return "";
  }

  removeTag(tag: string) {
    (this.articleForm.get("tags").value as string[]).splice(
      (this.articleForm.get("tags").value as string[]).findIndex((el) => el === tag),
      1
    );
    this.articleForm.get("tags").markAsDirty();
  }

  addTag(event: MatChipInputEvent) {
    let value = event.value.trim();
    if (value !== "") {
      (this.articleForm.get("tags").value as string[]).push(event.value);
    }
    event.input.value = "";
    this.articleForm.get("tags").markAsDirty();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
