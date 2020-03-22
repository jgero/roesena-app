import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "toLocalTimeString"
})
export class ToLocalTimeStringPipe implements PipeTransform {
  transform(value: Date): string {
    return `${value
      .getHours()
      .toString()
      .padStart(2, "0")}:${value
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }
}
