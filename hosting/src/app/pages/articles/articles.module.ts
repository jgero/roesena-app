import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ArticlesRoutingModule } from "./articles-routing.module";
import { OverviewComponent } from "./overview/overview.component";
import { EditorComponent } from "./editor/editor.component";
import { DetailComponent } from "./detail/detail.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { CardsModule } from "src/app/shared/cards/cards.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
  declarations: [OverviewComponent, EditorComponent, DetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ArticlesRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    CardsModule,
  ],
})
export class ArticlesModule {}
