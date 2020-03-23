import { Pipe, PipeTransform } from "@angular/core";
import { appEvent } from "src/app/utils/interfaces";

@Pipe({
  name: "eventsByDate"
})
export class EventsByDatePipe implements PipeTransform {
  transform(value: appEvent[], searchString: string = "", descending: boolean = true): appEvent[] {
    if (!Array.isArray(value)) return value;
    if (searchString !== "") {
      value = value.filter(
        ev =>
          ev.title.toLowerCase().includes(searchString.toLowerCase()) ||
          ev.description.toLowerCase().includes(searchString.toLowerCase())
      );
    }
    if (descending) {
      return value.sort((a, b) => b.endDate.getTime() - a.endDate.getTime());
    } else {
      return value.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
    }
  }
}
