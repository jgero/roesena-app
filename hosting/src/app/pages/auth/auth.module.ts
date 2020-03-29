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
import { CustomFormElementsModule } from "src/app/shared/custom-form-elements/custom-form-elements.module";
import { NavigationUtilsModule } from "src/app/shared/navigation-utils/navigation-utils.module";
import { CardsModule } from "src/app/shared/cards/cards.module";
import { ConvertersModule } from "src/app/shared/converters/converters.module";
import { ResetComponent } from './reset/reset.component';

@NgModule({
  declarations: [
    LoginComponent,
    AuthPageComponent,
    RegisterComponent,
    ChangeNameComponent,
    MyEventsComponent,
    AuthLevelManagerComponent,
    ResetComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    CustomFormElementsModule,
    NavigationUtilsModule,
    CardsModule,
    ConvertersModule
  ]
})
export class AuthModule {}
