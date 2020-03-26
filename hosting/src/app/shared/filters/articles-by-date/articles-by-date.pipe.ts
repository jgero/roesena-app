import { Pipe, PipeTransform } from "@angular/core";
import { appArticle } from "src/app/utils/interfaces";

@Pipe({
  name: "articlesByDate"
})
export class ArticlesByDatePipe implements PipeTransform {
  transform(values: appArticle[], searchString: string, descending = false): appArticle[] {
    if (!Array.isArray(values)) return values;
    values = values.filter(
      art =>
        art.title.toLowerCase().includes(searchString.toLowerCase()) ||
        art.tags.some(tag => tag.toLowerCase().includes(searchString.toLowerCase()))
    );
    if (descending) {
      return values.sort((a, b) => b.created.getTime() - a.created.getTime());
    } else {
      return values.sort((a, b) => a.created.getTime() - b.created.getTime());
    }
  }
}
