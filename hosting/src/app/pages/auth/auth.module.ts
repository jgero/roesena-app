import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AuthRoutingModule } from "./auth-routing.module";

import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { AuthPageComponent } from "./auth-page.component";
import { ChangeNameComponent } from "./change-name/change-name.component";
import { MyEventsComponent } from "./my-events/my-events.component";
import { AuthLevelManagerComponent } from "./auth-level-manager/auth-level-manager.component";

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    LoginComponent,
    AuthPageComponent,
    RegisterComponent,
    ChangeNameComponent,
    MyEventsComponent,
    AuthLevelManagerComponent
  ],
  imports: [CommonModule, AuthRoutingModule, FormsModule, SharedModule]
})
export class AuthModule {}
