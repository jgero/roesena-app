import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer-component/footer.component';
import { CookieManagerComponent } from './footer-component/cookie-manager/cookie-manager.component';
import { MAT_BOTTOM_SHEET_DEFAULT_OPTIONS } from '@angular/material/bottom-sheet';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [FooterComponent, CookieManagerComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
  ],
  exports: [FooterComponent],
  providers: [{ provide: MAT_BOTTOM_SHEET_DEFAULT_OPTIONS, useValue: { hasBackdrop: true, disableClose: true } }],
})
export class FooterModule {}
