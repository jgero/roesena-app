import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { EventsRoutingModule } from "./events-routing.module";

import { EventsPageComponent } from "./events-page.component";
import { EventDetailsComponent } from "./event-details/event-details.component";
import { ParticipantComponent } from "./event-details/participant/participant.component";
import { EventEditorComponent } from "./event-editor/event-editor.component";

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [EventDetailsComponent, EventsPageComponent, ParticipantComponent, EventEditorComponent],
  imports: [CommonModule, EventsRoutingModule, FormsModule, SharedModule]
})
export class EventsModule {}
