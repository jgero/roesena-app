import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatChipsModule } from "@angular/material/chips";
import { MatListModule } from "@angular/material/list";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";

import { EventsRoutingModule } from "./events-routing.module";
import { OverviewComponent } from "./overview/overview.component";
import { CardsModule } from "src/app/shared/cards/cards.module";
import { FiltersModule } from "src/app/shared/filters/filters.module";
import { DetailsComponent } from "./details/details.component";
import { ConvertersModule } from "src/app/shared/converters/converters.module";
import { ParticipantChipComponent } from "./details/participant-chip/participant-chip.component";
import { EditorComponent } from "./editor/editor.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";

@NgModule({
  declarations: [OverviewComponent, DetailsComponent, ParticipantChipComponent, EditorComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EventsRoutingModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule,
    MatListModule,
    MatDatepickerModule,
    MatExpansionModule,
    CardsModule,
    FiltersModule,
    ConvertersModule,
  ],
})
export class EventsModule {}
