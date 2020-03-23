import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { EventsRoutingModule } from "./events-routing.module";

import { EventsPageComponent } from "./events-page.component";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { ParticipantComponent } from "./event-details/participant/participant.component";
import { EventEditorComponent } from "./event-editor/event-editor.component";
import { CustomFormElementsModule } from "src/app/shared/custom-form-elements/custom-form-elements.module";
import { ConvertersModule } from "src/app/shared/converters/converters.module";
import { CardsModule } from "src/app/shared/cards/cards.module";
import { FiltersModule } from "src/app/shared/filters/filters.module";

@NgModule({
  declarations: [EventDetailsComponent, EventsPageComponent, ParticipantComponent, EventEditorComponent],
  imports: [
    CommonModule,
    EventsRoutingModule,
    FormsModule,
    CustomFormElementsModule,
    ConvertersModule,
    CardsModule,
    FiltersModule
  ]
})
export class EventsModule {}
