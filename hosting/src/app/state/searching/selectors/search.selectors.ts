import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSearch from '../reducers/search.reducer';
import { State } from '@state/state.module';

export const selectSearchState = createFeatureSelector<fromSearch.State>(fromSearch.searchFeatureKey);

export const tagProposals = (state: State): string[] => {
  const tagSet = new Set<string>();
  // check if the current search string already includes a year
  const numberRegex = new RegExp('^[0-9]{4}$');
  if (state.search.searchStrings.some((el) => numberRegex.test(el))) {
    // already has a year
    const yearFromTag: number = +state.search.searchStrings.find((el) => numberRegex.test(el));
    if (yearFromTag >= new Date().getFullYear()) {
      tagSet.add((yearFromTag - 1).toString());
      tagSet.add((yearFromTag - 2).toString());
    } else {
      tagSet.add((yearFromTag + 1).toString());
      tagSet.add((yearFromTag - 1).toString());
    }
  } else {
    // has no year
    // add the last few years
    const currentYear: number = new Date().getFullYear();
    tagSet.add(currentYear.toString());
    tagSet.add((currentYear - 1).toString());
  }
  // add all the tags that are contained in the search results
  state.search.events.forEach((el) => el.tags.forEach((tag) => tagSet.add(tag)));
  state.search.articles.forEach((el) => el.tags.forEach((tag) => tagSet.add(tag)));
  state.search.images.forEach((el) => el.tags.forEach((tag) => tagSet.add(tag)));
  // remove the tags that are already in the search
  state.search.searchStrings.forEach((el) => tagSet.delete(el));
  return Array.from(tagSet).slice(0, 7);
};
