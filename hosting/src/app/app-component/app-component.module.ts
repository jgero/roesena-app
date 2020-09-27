import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FooterModule } from './footer/footer.module';
import { AppComponent } from './app.component';
import { SearchBarComponent, SearchSheetComponent } from './search-bar/search-bar.component';
import { RouterModule } from '@angular/router';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { AutocompleteFilterPipe } from './search-bar/autocomplete-filter.pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent, SearchBarComponent, SearchSheetComponent, AutocompleteFilterPipe],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FooterModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatBadgeModule,
    MatButtonModule,
    MatMenuModule,
    MatRadioModule,
    MatInputModule,
    MatAutocompleteModule,
    MatListModule,
    MatChipsModule,
    MatOptionModule,
  ],
  exports: [AppComponent],
})
export class AppComponentModule {}
