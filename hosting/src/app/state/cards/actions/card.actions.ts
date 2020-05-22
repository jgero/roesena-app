import { Action } from '@ngrx/store';

export enum CardActionTypes {
  TagClick = '[Card] tag clicked',
  NavigateToSearch = '[Card] navigate to search page',
}

export class TagClick implements Action {
  readonly type = CardActionTypes.TagClick;
  constructor(public payload: { tag: string }) {}
}

export class NavigateToSearch implements Action {
  readonly type = CardActionTypes.NavigateToSearch;
  constructor(public payload: { searchString: string }) {}
}

export type CardActions = TagClick | NavigateToSearch;
