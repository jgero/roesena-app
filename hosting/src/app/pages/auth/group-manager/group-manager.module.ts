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
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SearchModule } from '@shared/search/search.module';
import { PaginatorModule } from '@shared/paginator/paginator.module';
import { PersonTileComponent } from './person-tile/person-tile.component';

@NgModule({
  declarations: [GroupManagerComponent, PersonTileComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GroupManagerRoutingModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatChipsModule,
    MatProgressBarModule,
    SearchModule,
    PaginatorModule,
    StoreModule.forFeature(fromPerson.personFeatureKey, fromPerson.reducer),
    EffectsModule.forFeature([PersonEffects]),
  ],
})
export class GroupManagerModule {}
