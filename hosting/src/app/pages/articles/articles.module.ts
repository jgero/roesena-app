import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ArticlesRoutingModule } from "./articles-routing.module";
import { OverviewComponent } from "./overview/overview.component";
import { DetailComponent } from "./detail/detail.component";
import { EditorComponent } from "./editor/editor.component";
import { CardsModule } from "src/app/shared/cards/cards.module";
import { FiltersModule } from "src/app/shared/filters/filters.module";

@NgModule({
  declarations: [OverviewComponent, DetailComponent, EditorComponent],
  imports: [CommonModule, ArticlesRoutingModule, CardsModule, FiltersModule]
})
export class ArticlesModule {}
