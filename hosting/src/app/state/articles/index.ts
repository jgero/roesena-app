import { ArticleEditorEffects } from './effects/articleEditor.effects';
import { ArticleMultiEffects } from './effects/articleMulti.effects';
import { ArticleSingleEffects } from './effects/articleSingle.effects';

export * from './actions/article.actions';

export const ArticleEffects = [ArticleEditorEffects, ArticleMultiEffects, ArticleSingleEffects];

export * from './reducers/article.reducer';

export * from './selectors/article.selectors';
