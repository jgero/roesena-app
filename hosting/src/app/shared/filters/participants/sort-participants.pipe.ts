import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "sortParticipants",
})
export class SortParticipantsPipe implements PipeTransform {
  transform(value: { id: string; amount: number }[]): { id: string; amount: number }[] {
    return value.sort((a, b) => b.amount - a.amount);
  }
}
