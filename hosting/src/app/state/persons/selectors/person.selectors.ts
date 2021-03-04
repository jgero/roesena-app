import { State } from '@state/state.module';

export const canCreate = (state: State) => {
  const selectedUser = state.persons.user;
  if (!selectedUser) {
    return false;
  }
  if (selectedUser.groups.includes('admin') || selectedUser.groups.includes('Autor')) {
    return true;
  }
  return false;
};
