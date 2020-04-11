import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ImagesRoutingModule } from "./images-routing.module";
import { ImageOverviewComponent } from "./image-overview/image-overview.component";
import { CardsModule } from "src/app/shared/cards/cards.module";
import { ImageEditorComponent } from "./image-editor/image-editor.component";
import { ImageDetailsComponent } from "./image-details/image-details.component";
import { CustomFormElementsModule } from "src/app/shared/custom-form-elements/custom-form-elements.module";
import { FiltersModule } from "src/app/shared/filters/filters.module";

@NgModule({
  declarations: [ImageOverviewComponent, ImageEditorComponent, ImageDetailsComponent],
  imports: [CommonModule, ImagesRoutingModule, FormsModule, CardsModule, CustomFormElementsModule, FiltersModule]
})
export class ImagesModule {}
