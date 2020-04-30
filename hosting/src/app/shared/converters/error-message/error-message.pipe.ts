import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Pipe({
  name: "errorMessage",
})
export class ErrorMessagePipe implements PipeTransform {
  transform(ctrl: AbstractControl): string {
    if (ctrl.valid) return "";
    if (ctrl.getError("email")) return "Ungültige E-Mail";
    if (ctrl.getError("minlength")) return "Eingabe zu kurz";
    if (ctrl.getError("pattern")) return "Ungültige Eingabe";
    if (ctrl.getError("required")) return "Pflichtfeld";
    throw new Error("No error message implemented for error '" + ctrl.errors + "'");
  }
}
