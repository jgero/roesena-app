export function participantArrayToMap(
  partArr: { id: string; amount: number; name: string }[]
): { [key: string]: { amount: number; name: string } } {
  let res: { [key: string]: { amount: number; name: string } } = {};
  partArr.forEach((participant) => {
    const { amount, name } = participant;
    res[participant.id] = { amount, name };
  });
  return res;
}

export function participantMapToArray(partMap: {
  [key: string]: { amount: number; name: string };
}): { id: string; amount: number; name: string }[] {
  let res: { id: string; amount: number; name: string }[] = [];
  for (const key in partMap) {
    res.push({ id: key, amount: partMap[key].amount, name: partMap[key].name });
  }
  return res;
}
