import { Action } from '@ngrx/store';

export enum PageActionTypes {
  PageForward = '[Page] page forward',
  PageBackwards = '[Page] page backwards',
}

export class PageForward implements Action {
  readonly type = PageActionTypes.PageForward;
}
export class PageBackwards implements Action {
  readonly type = PageActionTypes.PageBackwards;
}

export type PageActions = PageForward | PageBackwards;
