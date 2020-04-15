import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatBadgeModule } from "@angular/material/badge";

import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { ProfileComponent } from "./profile/profile.component";
import { RegisterComponent } from "./register/register.component";
import { MyEventsComponent } from "./my-events/my-events.component";
import { ResetComponent } from "./reset/reset.component";
import { GroupManagerComponent } from "./group-manager/group-manager.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ConvertersModule } from "src/app/shared/converters/converters.module";

@NgModule({
  declarations: [LoginComponent, ProfileComponent, RegisterComponent, MyEventsComponent, ResetComponent, GroupManagerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,
    MatToolbarModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatBadgeModule,
    ConvertersModule,
  ],
})
export class AuthModule {}
