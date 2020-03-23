import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ImagesRoutingModule } from "./images-routing.module";
import { ImageOverviewComponent } from "./image-overview/image-overview.component";
import { CardsModule } from "src/app/shared/cards/cards.module";

@NgModule({
  declarations: [ImageOverviewComponent],
  imports: [CommonModule, ImagesRoutingModule, CardsModule]
})
export class ImagesModule {}
