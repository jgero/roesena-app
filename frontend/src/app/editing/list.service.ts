import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  public list: Observable<{ _id: string; value: string }[]>;

  constructor() {}
}
