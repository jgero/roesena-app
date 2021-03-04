import { PersonAuthEffects } from './effects/personAuth.effects';
import { PersonMultiEffects } from './effects/personMulti.effects';
import { PersonMutationEffects } from './effects/personMutation.effects';
import { PersonSingleEffects } from './effects/personSingle.effects';

export * from './actions/person.actions';

export const PersonEffects = [PersonAuthEffects, PersonMultiEffects, PersonMutationEffects, PersonSingleEffects];

export * from './reducers/person.reducer';

export * from './selectors/person.selectors';
