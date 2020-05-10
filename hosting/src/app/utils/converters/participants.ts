import { Participant } from '../interfaces';

export function participantArrayToMap(
  partArr: Participant[]
): { [key: string]: { amount: number; name: string; hasUnseenChanges: boolean } } {
  const res: { [key: string]: { amount: number; name: string; hasUnseenChanges: boolean } } = {};
  partArr.forEach((participant) => {
    const { amount, name, hasUnseenChanges } = participant;
    res[participant.id] = { amount, name, hasUnseenChanges };
  });
  return res;
}

export function participantMapToArray(partMap: {
  [key: string]: { amount: number; name: string; hasUnseenChanges: boolean };
}): Participant[] {
  const res: { id: string; amount: number; name: string; hasUnseenChanges }[] = [];
  for (const key in partMap) {
    if (partMap.hasOwnProperty(key)) {
      res.push({
        id: key,
        amount: partMap[key].amount,
        name: partMap[key].name,
        hasUnseenChanges: partMap[key].hasUnseenChanges,
      });
    }
  }
  return res;
}
