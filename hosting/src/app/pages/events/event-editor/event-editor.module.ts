import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventEditorRoutingModule } from './event-editor-routing.module';
import { EditorComponent } from './editor.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MarkdownViewerModule } from '@shared/markdown-viewer/markdown-viewer.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ConvertersModule } from '@shared/converters/converters.module';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StoreModule } from '@ngrx/store';
import * as fromEvent from '../../../state/events/editor/reducers/event.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EventEffects } from '../../../state/events/editor/effects/event.effects';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ParticipantAutocompleteFilterPipe } from './autocomplete-filter.pipe';
import { DeleteConfirmModule } from '@shared/delete-confirm/delete-confirm.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [EditorComponent, ParticipantAutocompleteFilterPipe],
  imports: [
    CommonModule,
    EventEditorRoutingModule,
    MatToolbarModule,
    MatInputModule,
    MarkdownViewerModule,
    DeleteConfirmModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatDialogModule,
    ConvertersModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatStepperModule,
    MatTabsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    StoreModule.forFeature(fromEvent.eventFeatureKey, fromEvent.reducer),
    EffectsModule.forFeature([EventEffects]),
  ],
})
export class EventEditorModule {}
