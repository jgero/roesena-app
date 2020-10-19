import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GroupManagerRoutingModule } from './group-manager-routing.module';
import { StoreModule } from '@ngrx/store';
import * as fromPerson from '@state/auth/group-manager/reducers/person.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PersonEffects } from '@state/auth/group-manager/effects/person.effects';
import { GroupManagerComponent } from './group-manager.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PaginatorModule } from '@shared/paginator/paginator.module';
import { HeadingsModule } from '@shared/headings/headings.module';
import { MatTableModule } from '@angular/material/table';
import { AddGroupDialogComponent } from './add-group-dialog/add-group-dialog.component';
import { DeleteConfirmModule } from '@shared/delete-confirm/delete-confirm.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [GroupManagerComponent, AddGroupDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GroupManagerRoutingModule,
    HeadingsModule,
    DeleteConfirmModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressBarModule,
    PaginatorModule,
    StoreModule.forFeature(fromPerson.personFeatureKey, fromPerson.reducer),
    EffectsModule.forFeature([PersonEffects]),
  ],
})
export class GroupManagerModule {}
