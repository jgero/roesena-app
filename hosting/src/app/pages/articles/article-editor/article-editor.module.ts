import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MarkdownViewerModule } from '@shared/markdown-viewer/markdown-viewer.module';
import { ConvertersModule } from '@shared/converters/converters.module';
import { DeleteConfirmModule } from '@shared/delete-confirm/delete-confirm.module';
import { UsageHintsModule } from '@shared/usage-hints/usage-hints.module';

import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { EditorComponent } from './editor.component';
import { ArticleEditorRoutingModule } from './article-editor-routing.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FiltersModule } from '@shared/filters/filters.module';

@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    DeleteConfirmModule,
    UsageHintsModule,
    MarkdownViewerModule,
    ConvertersModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTabsModule,
    MatTooltipModule,
    MatAutocompleteModule,
    FiltersModule,
    ArticleEditorRoutingModule,
  ],
})
export class ArticleEditorModule {}
