import { AutocompleteFilterPipe } from './autocomplete-filter.pipe';

describe('AutocompleteFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new AutocompleteFilterPipe();
    expect(pipe).toBeTruthy();
  });

  it('should remove not matching strings from array', () => {
    const pipe = new AutocompleteFilterPipe();
    expect(pipe.transform(['asdf', 'test', '123'], 'TesT')).toEqual(['test']);
  });
});
