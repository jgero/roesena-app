import { EventEditorEffects } from './effects/eventEditor.effects';
import { EventMultiEffects } from './effects/eventMulti.effects';
import { EventSingleEffects } from './effects/eventSingle.effects';

export * from './actions/event.actions';

export const EventEffects = [EventEditorEffects, EventMultiEffects, EventSingleEffects];

export * from './reducers/event.reducer';

export * from './selectors/event.selectors';
