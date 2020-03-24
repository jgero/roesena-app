import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { DropdownComponent } from "./dropdown/dropdown.component";
import { InputComponent } from "./input/input.component";
import { PersonManagerComponent } from "./person-manager/person-manager.component";
import { TagInputComponent } from "./tag-input/tag-input.component";

const components = [DropdownComponent, InputComponent, PersonManagerComponent, TagInputComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, FormsModule],
  exports: components
})
export class CustomFormElementsModule {}
