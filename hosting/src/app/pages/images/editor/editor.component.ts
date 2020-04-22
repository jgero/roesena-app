import { Component, OnInit, OnDestroy } from "@angular/core";
import { Observable, of, zip, Subscription, BehaviorSubject } from "rxjs";
import { appImage } from "src/app/utils/interfaces";
import { ActivatedRoute, Router } from "@angular/router";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { FormGroup, FormControl } from "@angular/forms";
import { tap, map, delay } from "rxjs/operators";
import { AuthService } from "src/app/services/auth.service";
import { MatChipInputEvent } from "@angular/material/chips";
import { ENTER, COMMA } from "@angular/cdk/keycodes";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnDestroy {
  $image: Observable<appImage>;
  $url = new BehaviorSubject<string>("");
  imageForm: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private image: appImage;
  private subs: Subscription[] = [];

  constructor(route: ActivatedRoute, private imageDAO: ImageDalService, private router: Router, auth: AuthService) {
    const id = route.snapshot.paramMap.get("id");
    this.$image = (id
      ? this.imageDAO.getById(id).pipe(
          tap((event) => {
            if (!event) {
              router.navigate(["images", "overview"]);
            }
          })
        )
      : of<appImage>({ created: new Date(), ownerId: auth.$user.getValue().id, id: "", tags: [] })
    ).pipe(
      tap((image) => {
        if (image === null) this.router.navigate(["images", "overview"]);
        // set the url to the one loaded from the image, only if the image already exists
        if (image.id) {
          this.subs.push(this.imageDAO.getDownloadURL(image.id).subscribe({ next: (url) => this.$url.next(url) }));
        }
        this.image = image;
        this.imageForm = new FormGroup({
          tags: new FormControl(image.tags),
          image: new FormControl(""),
        });
      })
    );
  }

  onSubmit() {
    this.imageForm.disable();
    let updated = this.image;
    updated.tags = this.imageForm.get("tags").value;
    const action = this.image.id
      ? this.imageDAO.update(updated, this.imageForm.get("image").value).pipe(
          tap(() => {
            this.imageForm.enable();
            this.imageForm.markAsPristine();
          })
        )
      : this.imageDAO
          .insert(updated, this.imageForm.get("image").value)
          .pipe(tap((newId) => this.router.navigate(["images", "edit", newId])));
    this.subs.push(action.subscribe(null, null, null));
  }

  onDelete() {
    this.subs.push(this.imageDAO.delete(this.image.id).subscribe({ next: () => this.router.navigate(["images", "overview"]) }));
  }

  onImageChange(file: File) {
    if (!file) return;
    var fr = new FileReader();
    fr.onload = () => {
      this.imageForm.get("image").setValue(fr.result);
      this.imageForm.get("image").markAsDirty();
      this.$url.next(fr.result as string);
    };
    fr.readAsDataURL(file);
  }

  removeTag(tag: string) {
    (this.imageForm.get("tags").value as string[]).splice(
      (this.imageForm.get("tags").value as string[]).findIndex((el) => el === tag),
      1
    );
    this.imageForm.get("tags").markAsDirty();
  }

  addTag(event: MatChipInputEvent) {
    let value = event.value.trim();
    if (value !== "") {
      (this.imageForm.get("tags").value as string[]).push(event.value);
    }
    event.input.value = "";
    this.imageForm.get("tags").markAsDirty();
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
