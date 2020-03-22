import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { EventCardComponent } from "./event-card/event-card.component";

import { ConvertersModule } from "../converters/converters.module";

const components = [EventCardComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, RouterModule, ConvertersModule],
  exports: components
})
export class CardsModule {}
