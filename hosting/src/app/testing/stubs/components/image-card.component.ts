import { Component, Input } from "@angular/core";
import { appImage } from "src/app/utils/interfaces";

@Component({ selector: "app-image-card", template: "" })
export class ImageCardStub {
  @Input() image: appImage;
}
