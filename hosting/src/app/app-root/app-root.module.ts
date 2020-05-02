import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { AngularFireModule } from "@angular/fire";
import { environment } from "src/environments/environment";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireFunctionsModule } from "@angular/fire/functions";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { ServiceWorkerModule } from "@angular/service-worker";
import { MarkdownModule } from "ngx-markdown";

import { MatNativeDateModule, MAT_DATE_LOCALE } from "@angular/material/core";
import { LayoutModule } from "@angular/cdk/layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatBadgeModule } from "@angular/material/badge";

import { AppRootRoutingModule } from "./app-root-routing.module";
import { RootComponent } from "./root/root.component";
import { StartPageComponent } from "./start-page/start-page.component";
import { CardsModule } from "../shared/cards/cards.module";
import { AboutComponent } from "./about/about.component";
import { NotFoundComponent } from "./not-found/not-found.component";

@NgModule({
  declarations: [RootComponent, StartPageComponent, AboutComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRootRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireFunctionsModule,
    AngularFireStorageModule,
    ServiceWorkerModule.register("ngsw-worker.js", { enabled: environment.production }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatExpansionModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatProgressBarModule,
    CardsModule,
    MarkdownModule.forRoot(),
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: "de" }],
  bootstrap: [RootComponent],
})
export class AppRootModule {}
