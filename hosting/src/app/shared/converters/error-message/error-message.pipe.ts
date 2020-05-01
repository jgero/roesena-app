import { Pipe, PipeTransform } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Pipe({
  name: "errorMessage",
})
export class ErrorMessagePipe implements PipeTransform {
  transform(ctrl: AbstractControl): string {
    if (ctrl.valid) return "";
    if (ctrl.getError("email")) return "Ungültige E-Mail";
    if (ctrl.hasError("maxlength")) return "Eingabe zu lang";
    if (ctrl.getError("minlength")) return "Eingabe zu kurz";
    if (ctrl.hasError("matDatepickerParse")) return "Datum ungültig";
    if (ctrl.hasError("dateAndTime")) return "Datum und Zeit müssen eingegeben werden";
    if (ctrl.hasError("mustContainSelf")) return "Man muss selbst Teilnehmer sein";
    if (ctrl.hasError("participantsMissing")) return "Teilnehmer dürfen nicht leer sein wenn Deadline festgelegt ist";
    if (ctrl.getError("pattern")) return "Ungültige Eingabe";
    if (ctrl.getError("required")) return "Pflichtfeld";
    throw new Error("No error message implemented for error '" + ctrl.errors + "'");
  }
}
