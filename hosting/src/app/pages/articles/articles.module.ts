import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ArticlesRoutingModule } from "./articles-routing.module";
import { OverviewComponent } from "./overview/overview.component";
import { EditorComponent } from "./editor/editor.component";
import { DetailsComponent } from "./details/details.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatGridListModule } from "@angular/material/grid-list";
import { CardsModule } from "src/app/shared/cards/cards.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ConvertersModule } from "src/app/shared/converters/converters.module";
import { MatChipsModule } from "@angular/material/chips";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MarkdownModule } from "ngx-markdown";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MarkdownViewerModule } from "src/app/shared/markdown-viewer/markdown-viewer.module";

@NgModule({
  declarations: [OverviewComponent, EditorComponent, DetailsComponent],
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
    MatProgressSpinnerModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatPaginatorModule,
    CardsModule,
    ConvertersModule,
    MarkdownViewerModule,
  ],
})
export class ArticlesModule {}
