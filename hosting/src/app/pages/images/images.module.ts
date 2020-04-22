import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ImagesRoutingModule } from "./images-routing.module";
import { OverviewComponent } from "./overview/overview.component";
import { DetailsComponent } from "./details/details.component";
import { EditorComponent } from "./editor/editor.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { CardsModule } from "src/app/shared/cards/cards.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@NgModule({
  declarations: [OverviewComponent, DetailsComponent, EditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ImagesRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    CardsModule,
  ],
})
export class ImagesModule {}
