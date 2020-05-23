import * as EditorActions from './editor.actions';

describe('Editor', () => {
  it('should create an instance', () => {
    expect(new EditorActions.LoadEditors()).toBeTruthy();
  });
});
