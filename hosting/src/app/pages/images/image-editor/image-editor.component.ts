import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { appImage } from "src/app/utils/interfaces";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-image-editor",
  templateUrl: "./image-editor.component.html",
  styleUrls: ["./image-editor.component.scss"]
})
export class ImageEditorComponent {
  image: appImage;
  isNew: boolean;

  constructor(route: ActivatedRoute, private auth: AuthService) {
    if (route.snapshot.paramMap.get("id")) {
      this.image = route.snapshot.data.appImage;
      this.isNew = false;
    } else {
      this.image = {
        id: "",
        ownerId: "",
        tags: [],
        title: "",
        url: ""
      };
      this.isNew = true;
    }
  }

  onSubmit() {}
}
