import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { ConvertersModule } from "../converters/converters.module";

import { EventCardComponent } from "./event-card/event-card.component";
import { ImageCardComponent } from "./image-card/image-card.component";
import { ArticleCardComponent } from "./article-card/article-card.component";
import { TagsComponent } from "./tags/tags.component";

const components = [EventCardComponent, ImageCardComponent, ArticleCardComponent, TagsComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, RouterModule, ConvertersModule],
  exports: components
})
export class CardsModule {}
