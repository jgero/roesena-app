import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatGridListModule } from "@angular/material/grid-list";

import { EventsRoutingModule } from "./events-routing.module";
import { OverviewComponent } from "./overview/overview.component";
import { CardsModule } from "src/app/shared/cards/cards.module";
import { FiltersModule } from "src/app/shared/filters/filters.module";

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    EventsRoutingModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatGridListModule,
    CardsModule,
    FiltersModule,
  ],
})
export class EventsModule {}
