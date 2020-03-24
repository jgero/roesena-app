import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { appImage } from "src/app/utils/interfaces";
import { ImageDalService } from "src/app/services/DAL/image-dal.service";

@Component({
  selector: "app-image-editor",
  templateUrl: "./image-editor.component.html",
  styleUrls: ["./image-editor.component.scss"]
})
export class ImageEditorComponent {
  image: appImage;
  id: string;
  isNew: boolean;

  constructor(route: ActivatedRoute, private imageDAO: ImageDalService, private router: Router) {
    this.id = route.snapshot.paramMap.get("id");
    if (route.snapshot.paramMap.get("id")) {
      this.image = route.snapshot.data.appImage;
      this.isNew = false;
    } else {
      this.image = {
        id: "",
        ownerId: "",
        tags: [],
        title: ""
      };
      this.isNew = true;
    }
  }

  onSubmit({ title, file, tags }: any) {
    if (this.isNew) {
      this.imageDAO.insert(title, file, tags).subscribe({ next: () => this.router.navigate(["images", "overview"]) });
    } else {
      this.image.title = title;
      this.image.tags = tags;
      this.imageDAO.update(this.image, file).subscribe({ next: () => this.router.navigate(["images", "overview"]) });
    }
  }

  onDelete() {
    this.imageDAO.delete(this.id).subscribe({ next: () => this.router.navigate(["images", "overview"]) });
  }
}
