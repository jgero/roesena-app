import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalSearchService {
  public searchString = new BehaviorSubject<string>('');

  constructor() {}
}
