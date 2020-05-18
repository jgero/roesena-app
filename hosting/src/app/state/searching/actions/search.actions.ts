import { Action } from '@ngrx/store';

export enum SearchActionTypes {
  InitSearch = '[search component] init search strings',
  AddSearchString = '[search component] add search string',
  RemoveSearchString = '[search component] remove search string',
  RunSearch = '[search component] run search',
}

export class RunSearch implements Action {
  readonly type = SearchActionTypes.RunSearch;
}
export class InitSearch implements Action {
  readonly type = SearchActionTypes.InitSearch;
  constructor(
    public payload: {
      searchStrings: string[];
    }
  ) {}
}

export class AddSearchString implements Action {
  readonly type = SearchActionTypes.AddSearchString;
  constructor(
    public payload: {
      searchString: string;
    }
  ) {}
}
export class RemoveSearchString implements Action {
  readonly type = SearchActionTypes.RemoveSearchString;
  constructor(
    public payload: {
      searchString: string;
    }
  ) {}
}

export type SearchActions = RunSearch | AddSearchString | RemoveSearchString | InitSearch;
