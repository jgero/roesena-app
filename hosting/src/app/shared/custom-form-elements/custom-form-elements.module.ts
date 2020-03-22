import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DropdownComponent } from "./dropdown/dropdown.component";
import { InputComponent } from "./input/input.component";
import { PersonManagerComponent } from "./person-manager/person-manager.component";
import { FormsModule } from "@angular/forms";

const components = [DropdownComponent, InputComponent, PersonManagerComponent];

@NgModule({
  declarations: components,
  imports: [CommonModule, FormsModule],
  exports: components
})
export class CustomFormElementsModule {}
