import { Action } from '@ngrx/store';
import { AppArticle, AppEvent, AppImage } from '@utils/interfaces';

export enum SearchActionTypes {
  InitSearch = '[search component] init search strings',
  AddSearchString = '[search component] add search string',
  RemoveSearchString = '[search component] remove search string',
  ChangeDataType = '[search component] change data type',
  RunSearch = '[search component] run search',
  SearchContentLoaded = '[search component] content loaded',
  SearchContentLoadFailed = '[search component] loading content failed',
}

export class ChangeDataType implements Action {
  readonly type = SearchActionTypes.ChangeDataType;
  constructor(public payload: { dataType: string }) {}
}
export class SearchContentLoaded implements Action {
  readonly type = SearchActionTypes.SearchContentLoaded;
  constructor(public payload: { articles: AppArticle[]; images: AppImage[]; events: AppEvent[] }) {}
}
export class SearchContentLoadFailed implements Action {
  readonly type = SearchActionTypes.SearchContentLoadFailed;
  constructor(public payload: { error: any }) {}
}
export class RunSearch implements Action {
  readonly type = SearchActionTypes.RunSearch;
}
export class InitSearch implements Action {
  readonly type = SearchActionTypes.InitSearch;
  constructor(public payload: { limit: number }) {}
}

export class AddSearchString implements Action {
  readonly type = SearchActionTypes.AddSearchString;
  constructor(public payload: { searchString: string }) {}
}
export class RemoveSearchString implements Action {
  readonly type = SearchActionTypes.RemoveSearchString;
  constructor(public payload: { searchString: string }) {}
}

export type SearchActions =
  | RunSearch
  | AddSearchString
  | RemoveSearchString
  | InitSearch
  | SearchContentLoaded
  | SearchContentLoadFailed
  | ChangeDataType;
