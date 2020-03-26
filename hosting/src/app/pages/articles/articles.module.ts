import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { ArticlesRoutingModule } from "./articles-routing.module";
import { OverviewComponent } from "./overview/overview.component";
import { DetailComponent } from "./detail/detail.component";
import { EditorComponent } from "./editor/editor.component";
import { CardsModule } from "src/app/shared/cards/cards.module";
import { FiltersModule } from "src/app/shared/filters/filters.module";
import { CustomFormElementsModule } from "src/app/shared/custom-form-elements/custom-form-elements.module";
import { ConvertersModule } from "src/app/shared/converters/converters.module";

@NgModule({
  declarations: [OverviewComponent, DetailComponent, EditorComponent],
  imports: [
    CommonModule,
    ArticlesRoutingModule,
    CardsModule,
    FiltersModule,
    FormsModule,
    CustomFormElementsModule,
    ConvertersModule
  ]
})
export class ArticlesModule {}
