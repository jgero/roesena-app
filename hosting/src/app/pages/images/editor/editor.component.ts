import { FormGroup, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy } from "@angular/core";
import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Subscription } from "rxjs";
import { tap } from "rxjs/operators";

import { appImage } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";
import { ChipsInputService } from "src/app/services/chips-input.service";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
})
export class EditorComponent implements OnDestroy {
  readonly initialImage: appImage;
  url: string;
  imageForm: FormGroup;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  private subs: Subscription[] = [];

  constructor(route: ActivatedRoute, private imageDAO: ImageDalService, private router: Router, public chips: ChipsInputService) {
    this.url = route.snapshot.data.url;
    this.initialImage = route.snapshot.data.image;
    this.imageForm = new FormGroup({
      tags: new FormControl(this.initialImage.tags),
      image: new FormControl(""),
    });
  }

  onSubmit() {
    this.imageForm.disable();
    let updated = this.initialImage;
    updated.tags = this.imageForm.get("tags").value;
    const action = this.initialImage.id
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
    this.subs.push(
      this.imageDAO.delete(this.initialImage.id).subscribe({ next: () => this.router.navigate(["images", "overview"]) })
    );
  }

  onImageChange(file: File) {
    if (!file) return;
    var fr = new FileReader();
    fr.onload = () => {
      this.imageForm.get("image").setValue(fr.result);
      this.imageForm.get("image").markAsDirty();
      this.url = fr.result as string;
    };
    fr.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}
